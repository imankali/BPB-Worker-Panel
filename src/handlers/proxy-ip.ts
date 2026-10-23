import { decompressGzipBase64, respond, HttpStatus } from '@common';
import { authenticate } from '@auth';
import { isPublicIPv4, isIPv4, resolveDNS } from '@cores/utils';
import { getGlobals } from '@settings';
import { fallback } from './utils';
import { connect } from 'cloudflare:sockets';

export async function handleProxyIPs(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const auth = await authenticate(request, env);
    if (!auth) {
        const url = new URL('./login', request.url)
        return Response.redirect(url, 302);
    }

    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'proxy-ip':
            return renderProxyIPs();

        case 'proxy-ip/get':
            return getProxyIPsInfo();

        case 'proxy-ip/test':
            return testProxyIP(request);

        default:
            return fallback(request);
    }
}

async function renderProxyIPs() {
    const str = await decompressGzipBase64(PROXY_IP_HTML_CONTENT);
    const html = str.replaceAll('__ICON__', ICON_CONTENT);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function getProxyIPCandidates(): Promise<string[]> {
    const { ipv4 } = await resolveDNS(_public_proxy_ip_, true);
    return [...new Set(ipv4.filter(isPublicIPv4))];
}

async function getProxyIPsInfo(): Promise<Response> {
    const ips = await getProxyIPCandidates();
    const geoLocInfo = await geoLookupBatch(ips);
    return respond(
        true,
        HttpStatus.OK,
        undefined,
        geoLocInfo
    );
}

interface GeoResult {
    ip: string;
    city?: string;
    country?: string;
    countryCode?: string;
    isp?: string;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
}

async function geoLookupBatch(ipList: string[]): Promise<GeoResult[]> {
    const results: GeoResult[] = [];
    // Small batches avoid hammering a public GeoIP API when DNS returns many addresses.
    for (const batch of chunkArray(ipList, 5)) {
        const batchResults = await Promise.all(batch.map(async (ip): Promise<GeoResult> => {
            try {
                const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
                    headers: { accept: 'application/json' },
                    signal: AbortSignal.timeout(5000)
                });
                if (!res.ok) throw new Error(`GeoIP provider returned HTTP ${res.status}`);
                const data: any = await res.json();
                if (!data.success) throw new Error(data.message || 'GeoIP lookup failed');
                return {
                    ip,
                    city: data.city || '-',
                    country: data.country || '-',
                    countryCode: data.country_code || '-',
                    isp: data.connection?.isp || '-'
                };
            } catch (error) {
                console.warn('GeoIP lookup failed:', error instanceof Error ? error.name : 'unknown');
                return { ip, city: '-', country: '-', countryCode: '-', isp: '-' };
            }
        }));
        results.push(...batchResults);
    }
    return results;
}

const DEFAULT_SNI = 'speed.cloudflare.com';
const TIMEOUT_MS = 5000;
const ATTEMPTS = 5;

interface Attempt {
    attempt: number;
    ok: boolean;
    elapsedMs: number;
}

async function checkProxyIP(address: string): Promise<Omit<Attempt, 'attempt'>> {
    const start = Date.now();
    const TEST_PATH = '/__down?bytes=5000';
    let socket: Socket | null = null;
    let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
        socket = connect({ hostname: address, port: 443 });
        timeout = setTimeout(() => {
            void socket?.close().catch(() => { });
        }, TIMEOUT_MS);

        await socket.opened;
        writer = socket.writable.getWriter();
        const req = `GET ${TEST_PATH} HTTP/1.1\r\nHost: ${DEFAULT_SNI}\r\nConnection: close\r\n\r\n`;
        await writer.write(new TextEncoder().encode(req));
        writer.releaseLock();
        writer = null;

        reader = socket.readable.getReader();
        let headers = '';
        const decoder = new TextDecoder();
        while (headers.length < 16 * 1024 && !headers.includes('\r\n\r\n')) {
            const { value, done } = await reader.read();
            if (done || !value) break;
            headers += decoder.decode(value, { stream: true });
        }

        const headerBlock = headers.split('\r\n\r\n', 1)[0];
        const isExpectedResponse = /^HTTP\/1\.[01] 400\b/.test(headerBlock);
        const hasCfRay = /^cf-ray:/im.test(headerBlock);
        return { ok: isExpectedResponse && hasCfRay, elapsedMs: Date.now() - start };
    } catch {
        return { ok: false, elapsedMs: Date.now() - start };
    } finally {
        if (timeout) clearTimeout(timeout);
        if (reader) {
            await reader.cancel().catch(() => { });
            try { reader.releaseLock(); } catch { }
        }
        if (writer) {
            await writer.abort().catch(() => { });
            try { writer.releaseLock(); } catch { }
        }
        await socket?.close().catch(() => { });
    }
}

async function testProxyIP(request: Request) {
    if (request.method !== 'GET') return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    const target = new URL(request.url).searchParams.get('target') || '';
    if (!target || target.includes('/') || !isIPv4(target)) {
        return respond(false, HttpStatus.BAD_REQUEST, 'A literal IPv4 address is required.');
    }

    let allowedTargets: string[];
    try {
        allowedTargets = await getProxyIPCandidates();
    } catch {
        return respond(false, HttpStatus.SERVICE_UNAVAILABLE, 'Could not resolve the configured Proxy IP list.');
    }
    if (!allowedTargets.includes(target)) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Only addresses currently published by the configured Proxy IP hostname can be tested.');
    }

    const attemptPromises = Array.from({ length: ATTEMPTS }, (_, i) =>
        checkProxyIP(target).then(res => ({ attempt: i + 1, ...res }))
    );

    const attempts = await Promise.all(attemptPromises);
    const successes = attempts.filter((a) => a.ok);
    const avgLatencyMs = successes.length
        ? Math.round(successes.reduce((sum, a) => sum + a.elapsedMs, 0) / successes.length)
        : null;

    return respond(true, HttpStatus.OK, '', {
        successRate: `${successes.length}/${ATTEMPTS}`,
        avgLatencyMs,
        attempts,
    });
}


