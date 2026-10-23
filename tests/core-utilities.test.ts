import test from 'node:test';
import assert from 'node:assert/strict';
import { base64DecodeUtf8 } from '../src/common/common';
import { extractProxyParams, getDomain, isPublicIPv4, resolveDNS } from '../src/cores/utils';
import { buildDNS } from '../src/cores/xray/dns';
import { getXrCustomConfigs } from '../src/cores/xray/configs';
import { getSbCustomConfig } from '../src/cores/sing-box/configs';
import { getClNormalConfig } from '../src/cores/clash/configs';
import { getGlobals, getKvSettings, getSettings, init } from '../src/settings/settings';
import { validateSettings } from '../src/settings/validators';
import { getDataset } from '../src/settings/kv';
import { convertToNAT64IPv6, isValidNAT64Prefix } from '../src/cores/nat64';
import { generateJWTToken } from '../src/auth/auth';
import { appendActivityLog, getRecentActivityLog, activityLogRetentionDays } from '../src/common/activity-log';

init(new Request('https://worker.example.test/test-secret/panel/panel'), { CF_PAGES: '0' } as any);
getKvSettings().customDomain = 'alt.example.test';
getKvSettings().bestPingUrl = 'https://probe.example.test/generate_204';
getKvSettings().customCdnAddrs = ['203.0.113.45'];
getKvSettings().customCdnHost = 'cdn-origin.example.test';
getKvSettings().customCdnSni = 'allowed-front.example.test';
getKvSettings().mciCdnAddrs = ['203.0.113.46'];
getKvSettings().mciCdnHost = 'mci-origin.example.test';
getKvSettings().mciCdnSni = 'mci-front.example.test';
getKvSettings().irancellCdnAddrs = ['203.0.113.47'];
getKvSettings().irancellCdnHost = 'irancell-origin.example.test';
getKvSettings().irancellCdnSni = 'irancell-front.example.test';

test('KV version migration preserves custom settings instead of resetting them', async () => {
    const defaults = getKvSettings();
    const storedSettings = {
        ...defaults,
        panelVersion: 'older-build',
        customCdnAddrs: ['198.51.100.20'],
        mciCdnAddrs: ['198.51.100.21'],
        mciCdnHost: 'mci.example.test',
        mciCdnSni: 'front.example.test'
    };
    const store = new Map<string, any>([
        ['proxySettings', storedSettings],
        ['warpAccounts', []],
        ['telegramBot', { telegramBotToken: '', telegramUserId: '' }]
    ]);
    const env = {
        kv: {
            get: async (key: string) => store.get(key) ?? null,
            put: async (key: string, value: string) => { store.set(key, JSON.parse(value)); }
        }
    } as any;

    const dataset = await getDataset(env);
    assert.equal(dataset.settings.panelVersion, 'test');
    assert.deepEqual(dataset.settings.customCdnAddrs, ['198.51.100.20']);
    assert.deepEqual(dataset.settings.mciCdnAddrs, ['198.51.100.21']);
    assert.equal(dataset.settings.mciCdnHost, 'mci.example.test');
});

test('login throttle counts malformed and failed credentials using a hashed client-IP key', async () => {
    const store = new Map<string, string>([['pwd', 'correct-password']]);
    const env = {
        kv: {
            get: async (key: string) => store.get(key) ?? null,
            put: async (key: string, value: string) => { store.set(key, value); },
            delete: async (key: string) => { store.delete(key); }
        }
    } as any;
    const makeRequest = (body: string) => new Request('https://worker.example.test/secret/login/authenticate', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': '192.0.2.45' },
        body
    });

    const malformed = await generateJWTToken(makeRequest('null'), env);
    assert.equal(malformed.status, 400);
    const [rateLimitKey] = [...store.keys()].filter(key => key.startsWith('auth:login:'));
    assert.ok(rateLimitKey);
    assert.equal(store.get(rateLimitKey), '1');

    for (let attempt = 0; attempt < 7; attempt++) {
        const wrong = await generateJWTToken(makeRequest(JSON.stringify({ username: 'owner@example.test', password: 'wrong' })), env);
        assert.equal(wrong.status, 401);
    }
    assert.equal(store.get(rateLimitKey), '8');

    const blocked = await generateJWTToken(makeRequest(JSON.stringify({ username: 'owner@example.test', password: 'correct-password' })), env);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get('Retry-After'), '600');
});

test('activity log stores timestamped events with a seven-day TTL and returns recent entries', async () => {
    const records = new Map<string, string>();
    const expirations: number[] = [];
    const env = {
        kv: {
            put: async (key: string, value: string, options: { expirationTtl: number }) => {
                records.set(key, value);
                expirations.push(options.expirationTtl);
            },
            list: async ({ prefix, limit }: { prefix: string; limit: number }) => ({
                keys: [...records.keys()].filter(key => key.startsWith(prefix)).sort().slice(0, limit).map(name => ({ name }))
            }),
            get: async (key: string) => records.has(key) ? JSON.parse(records.get(key)!) : null
        }
    } as any;
    const originalLog = console.log;
    console.log = () => { };
    try {
        await appendActivityLog(env, 'info', 'settings.updated', 'Settings were saved.');
        const events = await getRecentActivityLog(env);
        assert.equal(activityLogRetentionDays, 7);
        assert.equal(expirations[0], 7 * 24 * 60 * 60);
        assert.equal(events.length, 1);
        assert.equal(events[0].event, 'settings.updated');
        assert.equal(events[0].detail, 'Settings were saved.');
        assert.match(events[0].timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    } finally {
        console.log = originalLog;
    }
});

test('carrier CDN validation requires complete, unique edge profiles and accepts legacy omitted probe URLs', () => {
    const form: any = { ...getSettings(), bestPingUrl: undefined };
    const initialErrors = validateSettings(form) || [];
    assert.ok(!initialErrors.some(error => error.field === 'MCI candidate CDN'));
    assert.ok(!initialErrors.some(error => error.field === 'Irancell candidate CDN'));
    assert.ok(!initialErrors.some(error => error.field === 'Best Ping URL'));

    const validProbe = { ...getSettings(), bestPingUrl: 'https://probe.example.test/generate_204' };
    assert.ok(!(validateSettings(validProbe) || []).some(error => error.field === 'Best Ping URL'));
    const unsafeProbe = { ...validProbe, bestPingUrl: 'https://user:pass@probe.example.test/test' };
    assert.ok((validateSettings(unsafeProbe) || []).some(error => error.field === 'Best Ping URL'));

    const incomplete = { ...form, mciCdnSni: '' };
    assert.ok((validateSettings(incomplete) || []).some(error => error.field === 'MCI candidate CDN'));

    const duplicate = { ...form, irancellCdnAddrs: [...form.mciCdnAddrs] };
    assert.ok((validateSettings(duplicate) || []).some(error => error.field === 'Irancell candidate CDN'));

    const cidrAddress = { ...form, mciCdnAddrs: ['203.0.113.46/32'] };
    assert.ok((validateSettings(cidrAddress) || []).some(error => error.field === 'MCI candidate CDN Addresses'));

    const invalidNat64Prefix = { ...form, prefixes: ['[1:2:3:4:5:6:7:8]'] };
    assert.ok((validateSettings(invalidNat64Prefix) || []).some(error => error.field === 'NAT64 Prefixes'));
});

test('NAT64 RFC 6052 conversion honors all six prefix lengths and preserves legacy mappings', () => {
    const vectors = [
        ['2001:db8::/32', '2001:db8:c000:221::'],
        ['2001:db8:100::/40', '2001:db8:1c0:2:21::'],
        ['2001:db8:122::/48', '2001:db8:122:c000:2:2100::'],
        ['2001:db8:122:300::/56', '2001:db8:122:3c0:0:221::'],
        ['2001:db8:122:344::/64', '2001:db8:122:344:c0:2:2100:0'],
        ['64:ff9b::/96', '64:ff9b::c000:221']
    ];
    for (const [prefix, expected] of vectors) {
        assert.equal(convertToNAT64IPv6('192.0.2.33', prefix), `[${expected}]`);
        assert.equal(isValidNAT64Prefix(prefix), true);
    }

    assert.equal(convertToNAT64IPv6('192.0.2.33', '[2001:db8:1:2::]'), '[2001:db8:1:2::c000:0221]');
    assert.equal(isValidNAT64Prefix('[2001:db8:1:2::]'), true);
    assert.equal(isValidNAT64Prefix('2001:db8:1::/32'), false);
    assert.equal(isValidNAT64Prefix('64:ff9b::/120'), false);
    assert.equal(isValidNAT64Prefix('64:ff9b::/33'), false);
    assert.throws(() => convertToNAT64IPv6('192.000.2.33', '64:ff9b::/96'));
    assert.throws(() => convertToNAT64IPv6('256.0.2.33', '64:ff9b::/96'));
});

test('base64 decoder accepts URL-safe input and omitted padding', () => {
    assert.equal(base64DecodeUtf8('eyJ2YWx1ZSI6ICJ0ZXN0In0'), '{"value": "test"}');
    assert.equal(base64DecodeUtf8('eyJ2YWx1ZSI6ICJ0ZXN0In0='), '{"value": "test"}');
});

test('plain SOCKS credentials are not mistaken for Base64', () => {
    const params = extractProxyParams('socks://user:pass@example.com:1080');
    assert.equal(params.user, 'user');
    assert.equal(params.pass, 'pass');
    assert.equal(params.server, 'example.com');
    assert.equal(params.port, 1080);
});

test('Base64 SOCKS credentials still decode', () => {
    const auth = btoa('user:secret');
    const params = extractProxyParams(`socks://${auth}@proxy.example:1080`);
    assert.equal(params.user, 'user');
    assert.equal(params.pass, 'secret');
});

test('VMess payload parsing is independent of URL path splitting', () => {
    const config = {
        v: '2', ps: 'test', add: 'proxy.example', port: '443', id: '00000000-0000-0000-0000-000000000000',
        aid: '0', net: 'ws', type: 'none', host: 'cdn.example', path: '/x/test', tls: 'tls', sni: 'cdn.example'
    };
    const payload = btoa(JSON.stringify(config));
    const params = extractProxyParams(`vmess://${payload}`);
    assert.equal(params.protocol, 'vmess');
    assert.equal(params.server, 'proxy.example');
    assert.equal(params.path, '/x/test');
});

test('bare hostnames are recognized by getDomain', () => {
    assert.deepEqual(getDomain('sub.example.org'), { host: 'sub.example.org', isHostDomain: true });
});

test('outbound Proxy IP probe candidates must be public unicast IPv4 addresses', () => {
    assert.equal(isPublicIPv4('1.1.1.1'), true);
    assert.equal(isPublicIPv4('203.0.113.10'), false);
    assert.equal(isPublicIPv4('127.0.0.1'), false);
    assert.equal(isPublicIPv4('10.1.2.3'), false);
    assert.equal(isPublicIPv4('100.64.0.1'), false);
    assert.equal(isPublicIPv4('192.168.1.1'), false);
    assert.equal(isPublicIPv4('8.8.8.8/32'), false);
    assert.equal(isPublicIPv4('008.008.008.008'), false);
});

test('Xray DNS does not request AAAA when IPv6 is disabled', async () => {
    const originalFetch = globalThis.fetch;
    const queriedTypes: string[] = [];
    globalThis.fetch = async (input) => {
        const url = new URL(String(input));
        queriedTypes.push(url.searchParams.get('type') || '');
        return new Response(JSON.stringify({ Answer: [{ type: 1, data: '203.0.113.7' }] }), {
            status: 200,
            headers: { 'content-type': 'application/dns-json' }
        });
    };

    try {
        await buildDNS([], false, false, 'ipv6-disabled-test.example');
        assert.deepEqual(queriedTypes, ['A']);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('DoH failover is disabled by default to avoid disclosing names to extra resolvers', async () => {
    const originalFetch = globalThis.fetch;
    const originalDohUrl = getGlobals().dohUrl;
    const originalFallback = getGlobals().dohFallbackEnabled;
    getGlobals().dohUrl = 'https://dns.adguard-dns.com/dns-query';
    getGlobals().dohFallbackEnabled = false;
    const resolverHosts: string[] = [];
    globalThis.fetch = async (input) => {
        const url = new URL(String(input));
        resolverHosts.push(url.hostname);
        return new Response('unavailable', { status: 503 });
    };

    try {
        await assert.rejects(resolveDNS('doh-no-failover-test.example', true));
        assert.deepEqual(resolverHosts, ['dns.adguard-dns.com']);
    } finally {
        globalThis.fetch = originalFetch;
        getGlobals().dohUrl = originalDohUrl;
        getGlobals().dohFallbackEnabled = originalFallback;
    }
});

test('opt-in DoH failover retries the configured resolver through known public resolvers', async () => {
    const originalFetch = globalThis.fetch;
    const originalDohUrl = getGlobals().dohUrl;
    const originalFallback = getGlobals().dohFallbackEnabled;
    getGlobals().dohUrl = 'https://dns.adguard-dns.com/dns-query';
    getGlobals().dohFallbackEnabled = true;
    const resolverHosts: string[] = [];
    globalThis.fetch = async (input) => {
        const url = new URL(String(input));
        resolverHosts.push(url.hostname);
        if (url.hostname === 'dns.adguard-dns.com') return new Response('unavailable', { status: 503 });
        return new Response(JSON.stringify({ Answer: [{ type: 1, data: '203.0.113.8' }] }), {
            status: 200,
            headers: { 'content-type': 'application/dns-json' }
        });
    };

    try {
        const result = await resolveDNS('doh-failover-test.example', true);
        assert.deepEqual(result.ipv4, ['203.0.113.8']);
        assert.ok(resolverHosts.includes('dns.adguard-dns.com'));
        assert.ok(resolverHosts.includes('cloudflare-dns.com'));
    } finally {
        globalThis.fetch = originalFetch;
        getGlobals().dohUrl = originalDohUrl;
        getGlobals().dohFallbackEnabled = originalFallback;
    }
});


test('Xray, Sing-box and Clash emit parseable configs with CDN fronting overrides and the selected probe', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input) => {
        const url = new URL(String(input));
        if (!url.searchParams.has('name')) return new Response('', { status: 204 });
        return new Response(JSON.stringify({
            Answer: [
                { type: 1, data: '203.0.113.10' },
                { type: 28, data: '2001:db8::10' }
            ]
        }), { status: 200, headers: { 'content-type': 'application/dns-json' } });
    };

    try {
        const responses = await Promise.all([
            getXrCustomConfigs(false),
            getSbCustomConfig(false),
            getClNormalConfig()
        ]);
        const documents = await Promise.all(responses.map(response => response.json()));

        for (const document of documents) {
            const serialized = JSON.stringify(document);
            assert.ok(serialized.includes('https://probe.example.test/generate_204'));
            assert.ok(serialized.includes('worker.example.test'));
            assert.ok(serialized.includes('alt.example.test'));
            assert.ok(serialized.includes('203.0.113.45'));
            assert.ok(serialized.includes('cdn-origin.example.test'));
            assert.ok(serialized.includes('allowed-front.example.test'));
            assert.ok(serialized.includes('203.0.113.46'));
            assert.ok(serialized.includes('mci-origin.example.test'));
            assert.ok(serialized.includes('mci-front.example.test'));
            assert.ok(serialized.includes('203.0.113.47'));
            assert.ok(serialized.includes('irancell-origin.example.test'));
            assert.ok(serialized.includes('irancell-front.example.test'));
            assert.ok(!serialized.includes('"insecure":true'));
            assert.ok(!serialized.includes('"skip-cert-verify":true'));
        }

        assert.ok(documents[0].some((config: any) => config.remarks === '💦 MCI Candidate Best Ping 🚀'));
        assert.ok(documents[0].some((config: any) => config.remarks === '💦 Irancell Candidate Best Ping 🚀'));
        assert.ok(JSON.stringify(documents[1]).includes('💦 MCI candidates - Best Ping 🚀'));
        assert.ok(JSON.stringify(documents[1]).includes('💦 Irancell candidates - Best Ping 🚀'));
        assert.ok(JSON.stringify(documents[2]).includes('💦 MCI candidates - Best Ping 🚀'));
        assert.ok(JSON.stringify(documents[2]).includes('💦 Irancell candidates - Best Ping 🚀'));

        const sbOutbounds = documents[1].outbounds;
        const sbMciGroup = sbOutbounds.find((outbound: any) => outbound.tag === '💦 MCI candidates - Best Ping 🚀');
        const sbIrancellGroup = sbOutbounds.find((outbound: any) => outbound.tag === '💦 Irancell candidates - Best Ping 🚀');
        const sbTags = new Map(sbOutbounds.map((outbound: any) => [outbound.tag, outbound]));
        assert.ok(sbMciGroup.outbounds.length > 0);
        assert.ok(sbMciGroup.outbounds.every((tag: string) => sbTags.get(tag)?.tag.includes('MCI candidate')));
        assert.ok(sbIrancellGroup.outbounds.length > 0);
        assert.ok(sbIrancellGroup.outbounds.every((tag: string) => sbTags.get(tag)?.tag.includes('Irancell candidate')));

        const clashMciGroup = documents[2]['proxy-groups'].find((group: any) => group.name === '💦 MCI candidates - Best Ping 🚀');
        const clashIrancellGroup = documents[2]['proxy-groups'].find((group: any) => group.name === '💦 Irancell candidates - Best Ping 🚀');
        assert.equal(clashMciGroup['expected-status'], '200-299');
        assert.equal(clashIrancellGroup['expected-status'], '200-299');
        const clashProxies = new Map(documents[2].proxies.map((proxy: any) => [proxy.name, proxy]));
        assert.ok(clashMciGroup.proxies.length > 0);
        assert.ok(clashMciGroup.proxies.every((name: string) => clashProxies.get(name)?.name.includes('MCI candidate')));
        assert.ok(clashIrancellGroup.proxies.length > 0);
        assert.ok(clashIrancellGroup.proxies.every((name: string) => clashProxies.get(name)?.name.includes('Irancell candidate')));

        const mciXrayProfile = documents[0].find((config: any) => config.remarks === '💦 MCI Candidate Best Ping 🚀');
        const mciXrayNodes = mciXrayProfile.outbounds.filter((outbound: any) => outbound.settings?.vnext?.length);
        assert.ok(mciXrayNodes.length > 0);
        assert.ok(mciXrayNodes.every((outbound: any) => outbound.settings.vnext[0].address === '203.0.113.46'));
        assert.ok(Array.isArray(documents[0]));
        assert.ok(Array.isArray(documents[0][0].outbounds));
        assert.ok(Array.isArray(documents[1].outbounds));
        assert.ok(Array.isArray(documents[2].proxies));
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('Xray Best Ping candidate configs never reference a missing fallback outbound', async () => {
    const originalFetch = globalThis.fetch;
    const originalProtocols = getKvSettings().protocols;
    getKvSettings().protocols = 'vless';
    globalThis.fetch = async () => new Response(JSON.stringify({
        Answer: [{ type: 1, data: '203.0.113.10' }]
    }), { status: 200, headers: { 'content-type': 'application/dns-json' } });

    try {
        const response = await getXrCustomConfigs(false);
        const configs = await response.json();
        const mciBestPing = configs.find((config: any) => config.remarks === '💦 MCI Candidate Best Ping 🚀');
        assert.ok(mciBestPing, 'expected the MCI candidate Best Ping config');
        const outboundTags = new Set(mciBestPing.outbounds.map((outbound: any) => outbound.tag));
        for (const balancer of mciBestPing.routing.balancers) {
            if (balancer.fallbackTag) assert.ok(outboundTags.has(balancer.fallbackTag), `missing fallback ${balancer.fallbackTag}`);
        }
        assert.equal(mciBestPing.routing.balancers.find((balancer: any) => balancer.tag === 'all-proxies')?.fallbackTag, undefined);
    } finally {
        getKvSettings().protocols = originalProtocols;
        globalThis.fetch = originalFetch;
    }
});
