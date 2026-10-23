import { PanelSettings, TelegramBot } from '#types/settings';
import { deployPages, deletePagesProject } from '@api/pages';
import { getUsage } from '@api/usage';
import { fetchWarpAccounts } from '@api/warp';
import { deployWorkers, deleteWorker } from '@api/workers';
import { resetPassword, logout, authenticate } from '@auth';
import { decompressGzipBase64, respond, HttpStatus, safeError } from '@common';
import { getDataset, updateDataset } from '@kv';
import { buildScript, updateMainSettings } from '@main';
import { getGlobals, getMainSettings, getSettings, setSettings, subscriptions, clients } from '@settings';
import { validateSettings } from '@validators';
import { fallback } from './utils';
import { setTelegramBot } from '@api/telegram';
import { isIPv4, isIPv6, resolveDNS } from '@utils';
import { appendActivityLog, getRecentActivityLog, activityLogRetentionDays } from '../common/activity-log';

export async function handlePanel(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'panel':
            return renderPanel(request, env);

        case 'panel/settings':
            return getPanelSettings(request, env);

        case 'panel/update-settings':
            return updatePanelSettings(request, env);

        case 'panel/reset-settings':
            return resetPanelSettings(request, env);

        case 'panel/reset-password':
            return resetPanelPassword(request, env);

        case 'panel/activity-log':
            return getPanelActivityLog(request, env);

        case 'panel/my-ip':
            return getMyIP(request, env);

        case 'panel/diagnostics':
            return getPanelDiagnostics(request, env);

        case 'panel/ping':
            return pingPanel(request, env);

        case 'panel/update-warp':
            return updateWarpConfigs(request, env);

        case 'panel/update-panel':
            return updatePanel(request, env);

        case 'panel/delete-panel':
            return deletePanel(request, env);

        case 'panel/usage':
            return getUsage(request, env);

        case 'panel/logout':
            return logout();

        default:
            return fallback(request);
    }
}

async function resetPanelPassword(request: Request, env: Env): Promise<Response> {
    const response = await resetPassword(request, env);
    if (response.ok) {
        await appendActivityLog(env, 'info', 'security.password-updated', 'Panel password was set or changed.');
    }
    return response;
}

async function getPanelActivityLog(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET') return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    const auth = await authenticate(request, env);
    if (!auth) return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');

    try {
        const events = await getRecentActivityLog(env);
        return respond(true, HttpStatus.OK, undefined, { events, retentionDays: activityLogRetentionDays }, {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
    } catch {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Could not load the activity log.');
    }
}

async function renderPanel(request: Request, env: Env): Promise<Response> {
    const pwd = await env.kv.get('pwd');
    if (pwd) {
        const auth = await authenticate(request, env);
        if (!auth) {
            const url = new URL('./login', request.url);
            return Response.redirect(url, 302);
        }
    }

    const str = await decompressGzipBase64(PANEL_HTML_CONTENT);
    const html = str.replaceAll('__ICON__', ICON_CONTENT);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function updatePanel(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const { deployType } = getGlobals();
        const script = await buildScript(true);
        if (deployType === 'pages') {
            await deployPages(script);
        } else {
            await deployWorkers(script);
        }

        await appendActivityLog(env, 'info', 'panel.updated', 'Panel deployment completed successfully.');
        return respond(true, HttpStatus.OK);
    } catch (error) {
        await appendActivityLog(env, 'error', 'panel.update-failed', 'Panel deployment failed.');
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while upgrading panel: ${safeError(error)}`
        );
    }
}

async function deletePanel(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const { deployType } = getGlobals();
        await appendActivityLog(env, 'warning', 'panel.deletion-started', 'Panel deletion was requested.');
        if (deployType === 'pages') {
            await deletePagesProject();
        } else {
            await deleteWorker();
        }

        return respond(true, HttpStatus.OK);
    } catch (error) {
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while deleting panel: ${safeError(error)}`
        );
    }
}

async function getPanelSettings(request: Request, env: Env): Promise<Response> {
    const isPassSet = Boolean(await env.kv.get('pwd'));

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', { isPassSet });
        }

        const { settings: kvSettings, telegramBot } = await getDataset(env);
        const mainSettings = getMainSettings();
        const data = {
            proxySettings: { ...kvSettings, ...mainSettings },
            telegramSettings: telegramBot,
            subscriptions,
            clients,
            isPassSet
        };

        return respond(true, HttpStatus.OK, undefined, data, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
    } catch (error) {
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while fetching settings: ${safeError(error)}`
        );
    }
}

async function updatePanelSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'PUT') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const newSettings: PanelSettings = await request.json();
        const errors = validateSettings(newSettings);
        if (errors) return respond(false, HttpStatus.BAD_REQUEST, 'Validation Error', errors);

        await Promise.all([
            updateDataset(env, newSettings),
            updateMainSettings(newSettings)
        ]);

        const { securePath } = getGlobals();
        if (newSettings.securePath !== securePath) {
            const bot: TelegramBot | null = await env.kv.get('telegramBot', { type: 'json' });
            if (bot?.telegramBotToken) {
                await setTelegramBot(newSettings.securePath, bot.telegramBotToken);
            }
        }

        await appendActivityLog(env, 'info', 'settings.updated', 'Panel settings were saved.');
        return respond(true, HttpStatus.OK, '');
    } catch (error) {
        await appendActivityLog(env, 'error', 'settings.update-failed', 'Saving panel settings failed.');
        console.log(error);
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, safeError(error));
    }
}

async function resetPanelSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed!');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const [kvSettings, mainSettings] = await Promise.all([
            updateDataset(env),
            updateMainSettings(null)
        ]);

        await appendActivityLog(env, 'warning', 'settings.reset', 'Panel settings were restored to defaults.');
        return respond(true, HttpStatus.OK, '', { ...kvSettings, ...mainSettings });
    } catch (error) {
        await appendActivityLog(env, 'error', 'settings.reset-failed', 'Restoring panel defaults failed.');
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while resetting settings: ${safeError(error)}`
        );
    }
}


async function pingPanel(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET') return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    const auth = await authenticate(request, env);
    if (!auth) return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');

    return new Response(null, {
        status: HttpStatus.NO_CONTENT,
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache'
        }
    });
}

async function getPanelDiagnostics(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET') return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    const auth = await authenticate(request, env);
    if (!auth) return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');

    await setSettings(env);
    const { mainDomain } = getGlobals();
    const { enableIPv6 } = getSettings();
    // Keep Worker-side egress diagnostics on a fixed, known endpoint; never fetch the admin-configured client probe URL here.

    const [dnsResult, probeResult] = await Promise.allSettled([
        (async () => {
            const startedAt = Date.now();
            const resolved = await resolveDNS(mainDomain, !enableIPv6);
            return { ok: resolved.ipv4.length > 0 || resolved.ipv6.length > 0, elapsedMs: Date.now() - startedAt, ipv4: resolved.ipv4.length, ipv6: resolved.ipv6.length };
        })(),
        (async () => {
            const startedAt = Date.now();
            const response = await fetch('https://cp.cloudflare.com/generate_204', {
                signal: AbortSignal.timeout(5000),
                redirect: 'manual'
            });
            const status = response.status;
            await response.body?.cancel().catch(() => { });
            return { ok: status === 204, status, elapsedMs: Date.now() - startedAt };
        })()
    ]);

    const dnsOk = dnsResult.status === 'fulfilled' && dnsResult.value.ok;
    const connectivityOk = probeResult.status === 'fulfilled' && probeResult.value.ok;
    await appendActivityLog(env, dnsOk && connectivityOk ? 'info' : 'warning', 'diagnostics.completed',
        `Worker checks: DNS ${dnsOk ? 'passed' : 'failed'}; fixed egress probe ${connectivityOk ? 'passed' : 'failed'}.`);

    return respond(true, HttpStatus.OK, undefined, {
        dns: dnsResult.status === 'fulfilled'
            ? dnsResult.value
            : { ok: false, error: safeError(dnsResult.reason) },
        connectivityProbe: probeResult.status === 'fulfilled'
            ? probeResult.value
            : { ok: false, error: safeError(probeResult.reason) },
        note: 'DNS and the fixed Cloudflare 204 egress probe run from the Worker location, not from the user device or ISP. Best Ping runs separately in each client against the configured URL.'
    }, {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
    });
}

async function getMyIP(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    const auth = await authenticate(request, env);
    if (!auth) return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');

    const ip = (await request.text()).trim().replace(/^\[|\]$/g, '');
    if (!ip || ip.includes('/') || (!isIPv4(ip) && !isIPv6(`[${ip}]`))) {
        return respond(false, HttpStatus.BAD_REQUEST, 'A valid IPv4 or IPv6 address is required.');
    }

    try {
        const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error(`GeoIP provider returned HTTP ${response.status}`);
        const data: any = await response.json();
        if (!data.success) throw new Error(data.message || 'GeoIP lookup failed.');
        const geoLocation = {
            country: data.country || '-',
            countryCode: data.country_code || '-',
            city: data.city || '-',
            isp: data.connection?.isp || '-'
        };
        return respond(true, HttpStatus.OK, '', geoLocation);
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error fetching IP address: ${safeError(error)}`
        )
    }
}

async function updateWarpConfigs(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        await fetchWarpAccounts(env);
        await appendActivityLog(env, 'info', 'warp.updated', 'WARP configuration data was refreshed.');
        return respond(true, HttpStatus.OK, 'Warp configs updated successfully!');
    } catch (error) {
        await appendActivityLog(env, 'error', 'warp.update-failed', 'Refreshing WARP configuration data failed.');
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `An error occurred while updating Warp configs: ${safeError(error)}`
        );
    }
}