import { getSettings } from '@settings';
import { base64DecodeUtf8, safeError } from '@common';
import { UpstreamProxy } from '#types/settings';

interface DnsResult {
    ipv4: string[];
    ipv6: string[];
}

export interface GeoAsset {
    rule: boolean;
    type: string;
    geosite: string;
    geoip?: string;
    geositeURL?: string;
    geoipURL?: string;
    dns?: string;
    format?: string;
}

const dnsCache = new Map<string, { result: DnsResult; expires: number }>();

export async function resolveDNS(domain: string, onlyIPv4 = false): Promise<DnsResult> {
    const { dohUrl, dohFallbackEnabled } = getSettings();
    const allowFallback = dohFallbackEnabled === true;
    const cacheKey = `${dohUrl || 'default'}:${allowFallback}:${domain}:${onlyIPv4}`;
    const cached = dnsCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.result;

    // Failover can disclose queried names to additional resolver operators, so it is explicit opt-in.
    const resolvers = [...new Set([
        dohUrl,
        ...(allowFallback ? [
            'https://dns.adguard-dns.com/dns-query',
            'https://cloudflare-dns.com/dns-query',
            'https://dns.google/resolve'
        ] : [])
    ].filter((url): url is string => !!url))];
    let lastError: unknown;

    for (const resolver of resolvers) {
        try {
            const makeUrl = (type: 'A' | 'AAAA') => {
                const url = new URL(resolver);
                url.searchParams.set('name', domain);
                url.searchParams.set('type', type);
                return url.toString();
            };
            const [ipv4Result, ipv6Result] = await Promise.allSettled([
                fetchDNSRecords(makeUrl('A'), 1),
                onlyIPv4 ? Promise.resolve([]) : fetchDNSRecords(makeUrl('AAAA'), 28)
            ]);
            if (ipv4Result.status === 'rejected') throw ipv4Result.reason;
            // A failure to obtain AAAA data should not trigger duplicate A queries at another resolver.
            const result = {
                ipv4: ipv4Result.value,
                ipv6: ipv6Result.status === 'fulfilled' ? ipv6Result.value : []
            };
            dnsCache.set(cacheKey, { result, expires: Date.now() + 60_000 });
            if (dnsCache.size > 256) dnsCache.delete(dnsCache.keys().next().value!);
            return result;
        } catch (error) {
            lastError = error;
        }
    }

    throw new Error(`Error resolving DNS: ${safeError(lastError)}`);
}

export async function fetchDNSRecords(url: string, recordType: number): Promise<string[]> {
    try {
        const response = await fetch(url, {
            headers: { accept: 'application/dns-json' },
            signal: AbortSignal.timeout(4000)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: any = await response.json();

        if (!data.Answer) return [];

        return data.Answer
            .filter((record: any) => record.type === recordType)
            .map((record: any) => record.data);

    } catch (error) {
        // Do not echo the full DoH URL: it contains the queried name in its query string.
        throw new Error(`DoH request failed: ${safeError(error)}`);
    }
}

export function getProtocols() {
    const { protocols } = getSettings();
    return protocols.split(',');
}

export type MobileNetworkProfile = 'mci' | 'irancell';

export function getCdnProfile(address: string): MobileNetworkProfile | 'shared' | null {
    const { customCdnAddrs, mciCdnAddrs, irancellCdnAddrs } = getSettings();
    if (mciCdnAddrs.includes(address)) return 'mci';
    if (irancellCdnAddrs.includes(address)) return 'irancell';
    if (customCdnAddrs.includes(address)) return 'shared';
    return null;
}

export async function getConfigAddresses(domain: string, isFragment: boolean): Promise<string[]> {
    const { enableIPv6, customCdnAddrs, mciCdnAddrs, irancellCdnAddrs, cleanIPs } = getSettings();
    const { ipv4, ipv6 } = await resolveDNS(domain, !enableIPv6);
    const addrs = [
        domain,
        ...ipv4,
        ...ipv6.map((ip: string) => `[${ip}]`),
        ...cleanIPs
    ];

    const cdnAddrs = [...customCdnAddrs, ...mciCdnAddrs, ...irancellCdnAddrs];
    return addrs.concatIf(!isFragment, cdnAddrs);
}

export function generateRemark(
    index: number,
    port: number,
    address: string,
    protocol: string,
    domain: string,
    isFragment: boolean,
    isChain: boolean
): string {
    const { cleanIPs, customDomain, upstreamParams: { upstreamServer } } = getSettings();

    const chainSign = isChain ? '🔗 ' : '';
    const protoSign = protocol === _VL_ ? _VL_CAP_ : _TR_CAP_;

    const fragmentSign = isFragment ? 'F ' : '';
    const customDomainSign = domain === customDomain ? 'D ' : '';
    const cdnProfile = getCdnProfile(address);
    const cdnSign = cdnProfile === 'mci' ? 'MCI candidate ' : cdnProfile === 'irancell' ? 'Irancell candidate ' : cdnProfile === 'shared' ? 'C ' : '';
    const configType = `${fragmentSign}${customDomainSign}${cdnSign}`;

    let addressType;
    cleanIPs.includes(address)
        ? addressType = 'Clean IP'
        : addressType = isDomain(address) ? 'Domain' : isIPv4(address) ? 'IPv4' : isIPv6(address) ? 'IPv6' : '';

    return address === upstreamServer
        ? `💦 ${index}. ${chainSign}${protoSign} ${configType}- Upstream Proxy`
        : `💦 ${index}. ${chainSign}${protoSign} ${configType}- ${addressType} : ${port}`;
}

export function randomUpperCase(str: string): string {
    let result = '';

    for (let i = 0; i < str.length; i++) {
        result += Math.random() < 0.5 ? str[i].toUpperCase() : str[i];
    }

    return result;
}

export function getRandomString(lengthMin: number, lengthMax: number): string {
    let result = '';
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * (lengthMax - lengthMin + 1)) + lengthMin;

    for (let i = 0; i < length; i++) {
        result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return result;
}

export function generateWsPath(protocol: string): string {
    const proto = protocol === _VL_ ? 'vl' : 'tr';
    return `/${proto}/${getRandomString(16, 32)}`;
}

export function base64ToDecimal(base64: string): number[] {
    const binaryString = atob(base64);
    const hexString = Array
        .from(binaryString)
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');

    const decimalArray = hexString
        .match(/.{2}/g)!
        .map(hex => parseInt(hex, 16));

    return decimalArray;
}

export function isDomain(address: string): boolean {
    if (!address) return false;
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
    return domainRegex.test(address);
}

export function isIPv4(address: string): boolean {
    const ipv4Pattern = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipv4Pattern.test(address);
}

export function isPublicIPv4(address: string): boolean {
    if (!isIPv4(address) || address.includes('/')) return false;
    const octets = address.split('.');
    if (octets.some(octet => !/^(?:0|[1-9][0-9]{0,2})$/.test(octet))) return false;
    const [a, b, c] = octets.map(Number);
    if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
    if (a === 100 && b >= 64 && b <= 127) return false; // shared address space
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 192 && b === 0 && (c === 0 || c === 2)) return false; // special-use/documentation
    if (a === 192 && b === 88 && c === 99) return false; // deprecated 6to4 relay anycast
    if (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) return false;
    if (a === 203 && b === 0 && c === 113) return false; // documentation
    return true;
}

export function isIPv6(address: string): boolean {
    const ipv6Pattern = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/;
    return ipv6Pattern.test(address);
}

export function isIPv4CIDR(value: string) {
    const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipv4CidrRegex.test(value);
}

export function isIPv6CIDR(value: string) {
    const ipv6CidrRegex = /^(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7}|::)(?:\/(?:12[0-8]|1[01]?[0-9]|[0-9]?[0-9]))?$/;
    return ipv6CidrRegex.test(value);
}

export function isValidUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

export function isBase64(str: string): boolean {
    if (!str || str.length % 4 !== 0) return false;
    return /^[A-Za-z0-9+/=\r\n]+$/.test(str);
}

export function isHex(str: string): boolean {
    return /^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(str);
}

export function getDomain(url: string) {
    try {
        const newUrl = new URL(url);
        const host = newUrl.hostname;
        const isHostDomain = isDomain(host);

        return {
            host,
            isHostDomain
        };
    } catch {
        const isHostDomain = isDomain(url);
        return {
            host: isHostDomain ? url : '',
            isHostDomain
        };
    }
}

export function selectSniHost(address: string, domain: string) {
    const settings = getSettings();
    const profile = getCdnProfile(address);
    const profileHost = profile === 'mci'
        ? settings.mciCdnHost
        : profile === 'irancell'
            ? settings.irancellCdnHost
            : settings.customCdnHost;
    const profileSni = profile === 'mci'
        ? settings.mciCdnSni
        : profile === 'irancell'
            ? settings.irancellCdnSni
            : settings.customCdnSni;
    const host = profile ? profileHost : domain;
    const sni = profile ? profileSni : randomUpperCase(domain);

    // A custom edge IP does not justify disabling TLS certificate verification: the configured SNI must still validate.
    return { host, sni, allowInsecure: false };
}

export function parseHostPort(input: string, brackets?: boolean): { host: string, port: number } {
    const regex = /^(?:\[(?<ipv6>.+?)\]|(?<host>[^:]+))(:(?<port>\d+))?$/;
    const match = input.match(regex);

    if (!match || !match.groups) return { host: '', port: 0 };
    const { ipv6, host: plainHost, port: portStr } = match.groups;

    let host = ipv6 ?? plainHost ?? '';
    if (brackets && ipv6) host = `[${ipv6}]`;
    const port = portStr ? Number(portStr) : 0;

    return { host, port };
}

export function isHttps(port: number): boolean {
    const { httpsPorts } = getSettings();
    return httpsPorts.includes(port);
}

const isBypass = (type: string) => type === 'direct';
const isBlock = (type: string) => type === 'block';

export function accRoutingRules(geoAssets: GeoAsset[]) {
    const {
        customBypassRules,
        customBypassSanctionRules,
        customBlockRules
    } = getSettings();

    return {
        bypass: {
            geosites: geoAssets
                .filter(rule => isBypass(rule.type))
                .map(rule => rule.geosite),
            geoips: geoAssets
                .filter(rule => isBypass(rule.type) && rule.geoip)
                .map(rule => rule.geoip!),
            domains: [
                ...customBypassRules.filter(isDomain),
                ...customBypassSanctionRules.filter(isDomain)
            ],
            ips: customBypassRules.filter(rule => !isDomain(rule))
        },
        block: {
            geosites: geoAssets
                .filter(rule => isBlock(rule.type))
                .map(rule => rule.geosite),
            geoips: geoAssets
                .filter(rule => isBlock(rule.type) && rule.geoip)
                .map(rule => rule.geoip!),
            domains: customBlockRules.filter(isDomain),
            ips: customBlockRules.filter(rule => !isDomain(rule))
        }
    };
}

export function accDnsRules(geoAssets: GeoAsset[]) {
    const {
        localDNS,
        antiSanctionDNS,
        customBypassRules,
        customBypassSanctionRules,
        customBlockRules
    } = getSettings();

    return {
        bypass: {
            localDNS: {
                geositeGeoips: geoAssets
                    .filter(({ type, geoip, dns }) => isBypass(type) && geoip && dns === localDNS)
                    .map(({ geosite, geoip }) => ({ geosite, geoip })),
                geosites: geoAssets
                    .filter(({ type, geoip, dns }) => isBypass(type) && !geoip && dns === localDNS)
                    .map(rule => rule.geosite),
                domains: customBypassRules.filter(isDomain)
            },
            antiSanctionDNS: {
                geosites: geoAssets
                    .filter(rule => isBypass(rule.type) && rule.dns === antiSanctionDNS)
                    .map(rule => rule.geosite),
                domains: customBypassSanctionRules.filter(isDomain)
            }
        },
        block: {
            geosites: geoAssets
                .filter(rule => isBlock(rule.type))
                .map(rule => rule.geosite),
            domains: customBlockRules.filter(isDomain)
        }
    };
}

export function toRange(min?: number, max?: number) {
    if (!min || !max) return undefined;
    if (min === max) return String(min);
    return `${min}-${max}`;
}

Array.prototype.concatIf = function <T>(condition: boolean, concat: T | T[]): T[] {
    if (!condition) return this;
    if (Array.isArray(concat)) return [...this, ...concat];
    return [...this, concat]
}

Object.prototype.omitEmpty = function <T>(): T | undefined {
    if (Object.keys(this).length === 0) return undefined;
    return this as T;
}

export function extractProxyParams(chainProxy: string) {
    if (!chainProxy) return {};

    const vmessPrefix = `${_VM_}://`;
    if (chainProxy.toLowerCase().startsWith(vmessPrefix)) {
        const payload = chainProxy.slice(vmessPrefix.length).split(/[?#]/, 1)[0];
        const config = JSON.parse(base64DecodeUtf8(payload));
        return {
            protocol: _VM_,
            uuid: config.id,
            server: config.add,
            port: +config.port,
            aid: +config.aid,
            type: config.net,
            headerType: config.type,
            serviceName: config.path,
            authority: config.authority,
            path: config.path || undefined,
            host: config.host || undefined,
            security: config.tls,
            sni: config.sni,
            fp: config.fp,
            alpn: config.alpn || undefined
        };
    }

    const url = new URL(chainProxy);
    const protocol = url.protocol.slice(0, -1);
    const stdProtocol = protocol === 'ss' ? _SS_ : protocol.replace('socks5', 'socks');

    const configParams: Record<string, string | number | undefined> = {
        protocol: stdProtocol,
        server: url.hostname,
        port: +url.port
    };

    const parseParams = (queryParams: boolean, customParams: Record<string, string | undefined>) => {
        if (queryParams) {
            for (const [key, value] of url.searchParams) {
                configParams[key] = value || undefined;
            }
        }

        return {
            ...configParams,
            ...customParams
        };
    }

    switch (stdProtocol) {
        case _VL_:
            return parseParams(true, {
                uuid: url.username
            });

        case _TR_:
            return parseParams(true, {
                password: url.username
            });

        case _SS_:
            const auth = base64DecodeUtf8(url.username);
            const [first, ...rest] = auth.split(':');
            return parseParams(true, {
                method: first,
                password: rest.join(':')
            });

        case 'socks':
        case 'http': {
            let user: string | undefined;
            let pass: string | undefined;
            const safeDecode = (value: string) => {
                try { return decodeURIComponent(value); } catch { return value; }
            };
            const rawUsername = safeDecode(url.username);
            if (url.password) {
                user = rawUsername;
                pass = safeDecode(url.password);
            } else if (rawUsername) {
                try {
                    const decoded = base64DecodeUtf8(rawUsername);
                    if (decoded.includes(':')) [user, pass] = decoded.split(/:(.*)/s, 2);
                    else user = rawUsername;
                } catch {
                    user = rawUsername;
                }
            }

            return parseParams(false, {
                user: user || undefined,
                pass: pass || undefined
            });
        }

        default:
            return {};
    }
}

export function extractUpstreamParams(upstreamProxy: string): UpstreamProxy {
    let upstreamServer, upstreamPort;
    if (upstreamProxy) ({ host: upstreamServer, port: upstreamPort } = parseHostPort(upstreamProxy, true));
    return { upstreamServer, upstreamPort };
}