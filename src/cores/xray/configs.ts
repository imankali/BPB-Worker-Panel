import type { Balancer, Config, Observatory, Outbound } from '#types/xray';
import { getSettings, getWarpAccounts } from '@settings';
import { buildDokodemoInbound, buildMixedInbound } from './inbounds';
import { buildRoutingRules } from './routing';
import { buildDNS } from './dns';
import {
    buildChainOutbound,
    buildWebsocketOutbound,
    buildWarpOutbound,
    buildFreedomOutbound
} from './outbounds';

import {
    getConfigAddresses,
    generateRemark,
    getCdnProfile,
    isDomain,
    isHttps,
    parseHostPort,
    getProtocols
} from '@utils';

function buildBalancer(tag: string, selector: string, hasFallback: boolean): Balancer {
    return {
        tag,
        selector: [selector],
        strategy: {
            type: 'leastPing',
        },
        fallbackTag: hasFallback ? 'proxy-2' : undefined
    };
}

async function buildConfig(
    remark: string,
    outbounds: Outbound[],
    isBalancer: boolean,
    isChain: boolean,
    balancerFallback: boolean,
    isWarp: boolean,
    isWorkerLess: boolean,
    outboundAddrs: string[],
    domainToStaticIPs?: string,
    customDns?: string,
    customDnsHosts?: string[]
): Promise<Config> {
    const {
        fakeDNS,
        warpBestPingInterval,
        bestPingInterval,
        bestPingUrl,
        logLevel,
        allowLANConnection
    } = getSettings();
    let balancers, observatory;

    if (isBalancer) {
        const hasProxyFallback = balancerFallback && outbounds.some(outbound => outbound.tag === 'proxy-2');
        balancers = [buildBalancer('all-proxies', 'proxy', hasProxyFallback)]
            .concatIf(isChain, buildBalancer('all-chains', 'chain', false));

        observatory = {
            subjectSelector: isChain ? ['chain', 'proxy'] : ['proxy'],
            probeUrl: bestPingUrl || 'https://cp.cloudflare.com/generate_204',
            probeInterval: `${isWarp
                ? warpBestPingInterval
                : bestPingInterval}s`,
            enableConcurrency: true
        } satisfies Observatory;
    }

    const config: Config = {
        remarks: remark,
        version: {
            min: '26.2.6'
        },
        log: {
            loglevel: logLevel,
        },
        dns: await buildDNS(outboundAddrs, isWorkerLess, isWarp, domainToStaticIPs, customDns, customDnsHosts),
        inbounds: [
            buildMixedInbound(allowLANConnection, isWorkerLess, isWorkerLess || fakeDNS),
            buildDokodemoInbound(allowLANConnection),
            // buildTunInbound(isWorkerLess, fakeDNS)
        ],
        outbounds: [
            ...outbounds,
            {
                protocol: 'dns',
                settings: {
                    rules: [
                        {
                            action: 'hijack'
                        }
                    ]
                },
                tag: 'dns-out'
            },
            {
                protocol: 'freedom',
                settings: {
                    domainStrategy: 'UseIP'
                },
                tag: 'direct'
            },
            {
                protocol: 'blackhole',
                settings: {
                    response: {
                        type: 'http'
                    }
                },
                tag: 'block'
            },
        ],
        routing: {
            domainStrategy: 'IPIfNonMatch',
            rules: buildRoutingRules(isChain, isBalancer, isWorkerLess, isWarp),
            balancers
        },
        observatory,
        policy: {
            levels: {
                0: {
                    connIdle: 300,
                    handshake: 4,
                    uplinkOnly: 1,
                    downlinkOnly: 1
                }
            },
            system: {
                statsOutboundUplink: true,
                statsOutboundDownlink: true
            }
        },
        stats: {}
    };

    return config;
}

async function addBestPingConfigs(
    configs: Config[],
    totalAddresses: string[],
    proxyOutbounds: Outbound[],
    chainOutbounds: Outbound[],
    isFragment: boolean,
    isCustomDomain: boolean,
    mobileProfile?: 'mci' | 'irancell'
) {
    totalAddresses = [...new Set(totalAddresses)];
    const isChain = !!chainOutbounds.length;
    const chainSign = isChain ? '🔗 ' : '';
    const fragmentSign = isFragment ? 'F ' : '';
    const customDomainSign = isCustomDomain ? 'D ' : '';
    const configType = `${fragmentSign}${customDomainSign}`;

    const profileSign = mobileProfile === 'mci' ? 'MCI Candidate ' : mobileProfile === 'irancell' ? 'Irancell Candidate ' : '';
    const remark = `💦 ${chainSign}${profileSign}Best Ping ${configType}🚀`;
    const outbounds = [
        ...chainOutbounds,
        ...proxyOutbounds
    ];

    const config = await buildConfig(remark, outbounds, true, isChain, true, false, false, totalAddresses);

    if (isChain) {
        await addBestPingConfigs(configs, totalAddresses, proxyOutbounds, [], isFragment, isCustomDomain, mobileProfile);
    }

    configs.push(config);
}

async function addBestFragmentConfigs(
    configs: Config[],
    chainProxy?: Outbound
) {
    const { mainDomain, fragmentDelayMin, fragmentDelayMax } = getSettings();
    const isChain = !!chainProxy;
    const outbounds: Outbound[] = [];
    const bestFragValues = [
        '1-5', '1-10', '10-20', '20-30',
        '30-40', '40-50', '50-60', '60-70',
        '70-80', '80-90', '90-100', '10-30',
        '20-40', '30-50', '40-60', '50-70',
        '60-80', '70-90', '80-100', '100-200'
    ];

    bestFragValues.forEach((fragLength, index) => {
        if (isChain) {
            const chain = modifyOutbound(chainProxy, `chain-${index + 1}`, `proxy-${index + 1}`);
            outbounds.push(chain);
        }

        const proxy = buildWebsocketOutbound(
            `proxy-${index + 1}`,
            _VL_,
            mainDomain,
            443,
            mainDomain,
            true,
            fragLength,
            `${fragmentDelayMin}-${fragmentDelayMax}`
        );

        outbounds.push(proxy);
    });

    const chainSign = isChain ? '🔗 ' : '';
    const config = await buildConfig(
        `💦 ${chainSign}Smart Fragment 🧠`,
        outbounds,
        true,
        isChain,
        false,
        false,
        false,
        [],
        mainDomain
    );

    if (chainProxy) {
        await addBestFragmentConfigs(configs);
    }

    configs.push(config);
}

async function addWorkerlessConfigs(configs: Config[]) {
    const tlsFragment = buildFreedomOutbound(true, false, 'proxy');
    const udpNoise = buildFreedomOutbound(false, true, 'udp-noise');
    const httpFragment = buildFreedomOutbound(true, false, 'http-fragment', undefined, undefined, '1-1');
    const outbounds = [
        tlsFragment,
        httpFragment,
        udpNoise
    ];

    const cfDnsConfig = await buildConfig(
        `💦 1 - Serverless 🌟`,
        outbounds,
        false,
        false,
        false,
        false,
        true,
        [],
        undefined,
        'cloudflare-dns.com',
        ['cloudflare.com']
    );

    const googleDnsConfig = await buildConfig(
        `💦 2 - Serverless (AdGuard) 🌟`,
        outbounds,
        false,
        false,
        false,
        false,
        true,
        [],
        undefined,
        'dns.adguard-dns.com',
        ['94.140.14.14', '94.140.15.15']
    );

    configs.push(cfDnsConfig, googleDnsConfig);
}

export async function getXrCustomConfigs(isFragment: boolean): Promise<Response> {
    const {
        chainProxy,
        ports,
        mainDomain,
        customDomain,
        upstreamParams: { upstreamServer, upstreamPort }
    } = getSettings();

    const chainOutbound = chainProxy ? buildChainOutbound() : undefined;
    const domains = [mainDomain].concatIf(!!customDomain, customDomain);
    const protocols = getProtocols();

    const configs: Config[] = [];
    let index = 1;
    
    for (const domain of domains) {
        let totalHosts: string[] = [];
        const proxies: Outbound[] = [];
        const chains: Outbound[] = [];
        const mciHosts: string[] = [];
        const irancellHosts: string[] = [];
        const mciProxies: Outbound[] = [];
        const irancellProxies: Outbound[] = [];
        const mciChains: Outbound[] = [];
        const irancellChains: Outbound[] = [];
        const totalPorts = ports.filter(port => !isFragment && domain.endsWith('workers.dev') || isHttps(port));
        const hosts = await getConfigAddresses(domain, isFragment);
        mciHosts.push(...hosts.filter(host => getCdnProfile(host) === 'mci'));
        irancellHosts.push(...hosts.filter(host => getCdnProfile(host) === 'irancell'));
        
        if (upstreamServer && upstreamPort && !isFragment) {
            totalPorts.unshift(upstreamPort);
            hosts.unshift(upstreamServer);
        }

        totalHosts.push(...hosts);
        for (const protocol of protocols) {
            let protocolIndex = 1;

            for (const port of totalPorts) {
                for (const host of hosts) {
                    if ((port === upstreamPort) !== (host === upstreamServer)) continue;
                    const networkProfile = getCdnProfile(host);
                    if (networkProfile && !isHttps(port)) continue;

                    const outbound = buildWebsocketOutbound('proxy', protocol, host, port, domain, isFragment);
                    const proxy = modifyOutbound(outbound, `proxy-${index}`);
                    proxies.push(proxy);
                    if (networkProfile === 'mci') mciProxies.push(proxy);
                    if (networkProfile === 'irancell') irancellProxies.push(proxy);

                    const remark = generateRemark(protocolIndex, port, host, protocol, domain, isFragment, false);
                    const config = await buildConfig(remark, [outbound], false, false, false, false, false, [host]);
                    configs.push(config);

                    if (chainOutbound) {
                        const remark = generateRemark(protocolIndex, port, host, protocol, domain, isFragment, true);
                        const chainConfig = await buildConfig(remark, [chainOutbound, outbound], false, true, false, false, false, [host]);
                        configs.push(chainConfig);

                        const chain = modifyOutbound(chainOutbound, `chain-${index}`, `proxy-${index}`);
                        chains.push(chain);
                        if (networkProfile === 'mci') mciChains.push(chain);
                        if (networkProfile === 'irancell') irancellChains.push(chain);
                    }

                    protocolIndex++;
                    index++;
                }
            }
        }

        const isCustomDomain = domain === customDomain;
        await addBestPingConfigs(configs, totalHosts, proxies, chains, isFragment, isCustomDomain);
        if (!isFragment && mciProxies.length) {
            await addBestPingConfigs(configs, mciHosts, mciProxies, mciChains, false, isCustomDomain, 'mci');
        }
        if (!isFragment && irancellProxies.length) {
            await addBestPingConfigs(configs, irancellHosts, irancellProxies, irancellChains, false, isCustomDomain, 'irancell');
        }
    }

    if (isFragment) {
        await addBestFragmentConfigs(configs, chainOutbound);
        await addWorkerlessConfigs(configs);
    }

    const fileName = isFragment ? 'fragment' : 'normal';
    return new Response(JSON.stringify(configs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=${_project_SM_}-${fileName}-xray.json`,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}

export async function getXrWarpConfigs(
    isPro: boolean,
    isKnocker: boolean
): Promise<Response> {
    const { warpEndpoints } = getSettings();
    const warpAccounts = getWarpAccounts();

    const proIndicator = isPro ? ' Pro ' : ' ';
    const configs: Config[] = [];
    const proxies: Outbound[] = [];
    const chains: Outbound[] = [];
    const outboundDomains: string[] = [];

    for (const [index, endpoint] of warpEndpoints.entries()) {
        const { host } = parseHostPort(endpoint);
        if (isDomain(host)) outboundDomains.push(host);

        const warpOutbound = buildWarpOutbound(warpAccounts[0], endpoint, false, isPro, isKnocker);
        const wowOutbound = buildWarpOutbound(warpAccounts[1], endpoint, true, isPro, isKnocker);

        const warpConfig = await buildConfig(
            `💦 ${index + 1} - Warp${proIndicator}🇮🇷`,
            [warpOutbound],
            false,
            false,
            false,
            true,
            false,
            [host]
        );

        const wowConfig = await buildConfig(
            `💦 ${index + 1} - WoW${proIndicator}🌍`,
            [wowOutbound, warpOutbound],
            false,
            true,
            false,
            true,
            false,
            [host]
        );

        configs.push(warpConfig, wowConfig);

        const proxy = modifyOutbound(warpOutbound, `proxy-${index + 1}`);
        proxies.push(proxy);

        const chain = modifyOutbound(wowOutbound, `chain-${index + 1}`, `proxy-${index + 1}`);
        chains.push(chain);
    }

    const warpBestPing = await buildConfig(
        `💦 Warp${proIndicator}- Best Ping 🚀`,
        [...proxies],
        true,
        false,
        false,
        true,
        false,
        outboundDomains
    );

    const wowBestPing = await buildConfig(
        `💦 WoW${proIndicator}- Best Ping 🚀`,
        [...chains, ...proxies],
        true,
        true,
        false,
        true,
        false,
        outboundDomains
    );

    configs.push(warpBestPing, wowBestPing);

    const fileName = isPro ? 'warp-Pro' : 'warp';
    return new Response(JSON.stringify(configs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename=${_project_SM_}-${fileName}-xray.json`,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}

function modifyOutbound(outbound: Outbound, tag: string, dialerProxy?: string): Outbound {
    const newOutbound = structuredClone(outbound);
    newOutbound.tag = tag;

    if (dialerProxy && newOutbound.streamSettings?.sockopt) {
        newOutbound.streamSettings.sockopt.dialerProxy = dialerProxy;
    }

    return newOutbound;
}
