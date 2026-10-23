<h1 align="center">BPB Panel</h1>

### 🌏 Readme in [Farsi](README_fa.md)

<p align="center">
  <img src="docs/assets/images/panel-overview.jpg" alt="Panel overview">
</p>
<br>

## Introduction

This project provides a panel for managing **VLESS**, **Trojan** and **Warp** configurations, plus a configurable **DoH** service for supported clients. DNS and routing defaults are starting points, not guarantees: end-to-end availability depends on the ISP, client, domain and current network conditions. Deploy on **Workers** or **Pages** using [BPB Wizard](https://github.com/bia-pain-bache/BPB-Wizard).

🌟 If you found **BPB Panel** valuable, Your donations make all the difference 🌟

### USDT (BEP20)

```text
0xbdf15d41C56f861f25b2b11C835bd45dfD5b792F
```

## Features

1. **Free and Private**: No costs involved and the server is private.
2. **Intuitive Panel:** Streamlined for effortless navigation, configuration and use.
3. **Versatile Protocols:** Provides VLESS, Trojan and Wireguard (Cloudflare Warp) protocols.
4. **Worker DoH endpoint:** A ready-to-use DoH endpoint with a configurable upstream. Internal Worker DNS resolution uses only the configured resolver by default; installations without the new flag also migrate to disabled. Public failover through AdGuard, Cloudflare and Google is explicit opt-in because it can disclose queried hostnames to those providers.
5. **Warp Pro configs:** Optimized Warp for crucial circumstances.
6. **Fragment support:** Provides client-side Fragment profiles where supported; it is not a way to make a blocked domain reachable and does not guarantee connectivity.
7. **Comprehensive Routing Rules:** Bypassing Iran/China/Russia, Blocking QUIC, Porn, Ads, Malwares, Phishing and also bypassing sanctions.
8. **Chain Proxy:** Capable of adding a chain proxy (VLESS, Trojan, Shadowsocks, socks and http) to fix IP.
9. **Quick connect:** One-tap Hiddify import using a Sing-box profile, plus a Base64 Xray subscription link for V2rayNG.
10. **Timestamped activity:** The latest 100 admin events are retained in KV for up to 7 days and displayed in local time to the second; these entries exclude subscription URLs, IP addresses and passwords.
11. **Broad client compatibility:** Offers subscription links for Xray, Sing-box and Clash-Mihomo core cross-platform clients.
12. **Password-protected panel:** Provides secure and private panel with full authentication.
13. **Fully customizable:** Supports clean IPs/domains, Proxy IPs, DNS servers, ports, protocols, Warp endpoints and a configurable connectivity-test URL for Xray, Sing-box and Clash.
14. **Connection diagnostics:** Measures browser-to-Worker request RTT and checks DNS resolution plus a fixed Cloudflare 204 egress endpoint. These checks run from Cloudflare, not from the user's ISP; the configurable Best Ping URL is tested by clients from their own device/network.
15. **Node ability:** Can share settings and proxies across other BPB users.
16. **Proxy aggregation:** Supports aggregating other proxies into BPB and delivering them in a single subscription.

## Limitations and connection notes

1. **UDP:** This Worker implementation does not provide general UDP forwarding for VLESS/Trojan; UDP-dependent features may not work. DNS is provided through DoH profiles.
2. **Cloudflare quotas:** Limits depend on the account and Cloudflare product. Check the current account limits before high-volume use.
3. **Diagnostics scope:** The panel measures browser-to-Worker HTTP request RTT (median of three authenticated requests) and checks DNS and Worker egress. The RTT includes request handling and is not ICMP; DNS/egress checks run from Cloudflare. Test the subscription from the actual client and ISP to diagnose client-side filtering or reachability.
4. **Client compatibility:** XHTTP, Reality, IPv6 and Fragment support varies by core and version. Use the listed minimum client versions and test alternate profiles separately.
5. Local DNS and the client-side Best Ping URL are configurable. Best Ping measures HTTP latency, not throughput or long-term stability; status validation differs by core (Mihomo is configured for 2xx, while Xray and sing-box expose different probe semantics; see [Best Ping details](docs/BestPing.md)). NAT64 accepts RFC 6052 CIDR lengths `/32`, `/40`, `/48`, `/56`, `/64`, and `/96`; saved bracketed prefixes retain their legacy mapping until deliberately migrated (see [NAT64 notes](docs/NAT64Prefixes.md)). Defaults are only starting points; validate them with the target ISP and avoid enabling Fragment/Noise globally without measuring the results.

## Quick connect and activity logs

After deployment, use the panel's **Quick start** card:

1. On a device with Hiddify installed, tap **Open in Hiddify** and confirm adding the profile. Alternatively, copy the Sing-box profile URL and import it in Hiddify. Hiddify documents its import URI and Sing-box profile support in its [URL Scheme guide](https://github.com/hiddify/hiddify-app/wiki/URL-Scheme).
2. In V2rayNG, open **Subscription settings → Add subscription**, paste the link and refresh. The `raw` endpoint returns a Base64 Xray-compatible subscription list.
3. Treat these links as credentials: they contain the panel's private path and connection details. Do not post them publicly.

**Recent activity** shows the latest 100 admin events with local date/time to the second. Events live in the deployment's KV namespace for up to 7 days and exclude passwords, IP addresses and subscription URLs. KV is eventually consistent, so a new event can take a short time to appear; this is a best-effort admin activity list, not an immutable audit log or a log of every client request. On Workers, the panel's next update enables structured Cloudflare logs with invocation logs (which include request URLs) disabled; find custom logs in **Workers & Pages → Worker → Observability**. Pages Functions logs are viewable live in the dashboard/CLI but are not durably retained by Cloudflare; the KV admin activity list remains available on either deployment type.

These shortcuts do not guarantee a bypass or a particular speed. Results depend on the domain, CDN route, carrier, region, client and current network. Best Ping measures HTTP latency, not throughput or long-term stability.

## Shir-o-Khorshid-style CDN edge fronting

Shir-o-Khorshid is a community Psiphon client fork; reports from Iran describe it using manually supplied, newly reachable Akamai edge IPs. That approach was reported as unstable and region-dependent, not as a universal VPN protocol ([project](https://github.com/shirokhorshid/shirokhorshid-android), [network observations](https://github.com/net4people/bbs/issues/626), [June 2026 summary](https://amnezia.org/blog/amnezia-shutdown-digest-june-2026-global)). BPB is not Psiphon and cannot inherit its server network or Conduit protocol.

BPB provides **Custom CDN** overrides for VLESS/Trojan across Xray, Sing-box and Clash. The shared pool works across networks; optional **MCI candidate routes (AS197207)** and **Irancell candidate routes (AS44244)** let you keep separately tested edge pools, Host headers and TLS SNI values. These labels do not detect the SIM/operator or promise that a route works:

1. Only enter edge addresses tested from that exact mobile network. Addresses must be unique across the shared, MCI and Irancell pools; put an edge common to both operators in the shared pool.
2. Each configured pool needs all three values: edge **Addresses**, **Host** configured on the CDN property and routed to your service, and **SNI** accepted by that edge with a valid TLS certificate.
3. Save settings and refresh the subscription. Generated configs label candidate nodes clearly; Sing-box and Clash expose separate MCI/Irancell Best Ping groups, while Xray emits separate Best Ping profile entries. The client tests from the device/network where it is running. TLS certificate validation remains enabled.
4. Test full traffic and sustained connection on each SIM separately; a successful handshake or a low ping alone is not proof of a usable tunnel.

An arbitrary Akamai IP is not a tunnel endpoint: without a matching CDN property/origin configuration, it will not forward to this Worker. Do not copy unverified public IP lists or assume an edge that works on one carrier/city will work elsewhere. The panel's diagnostics run from the Worker/Cloudflare and cannot discover or verify edge IPs from the user's ISP. When the international route is completely cut, CDN fronting cannot create connectivity.

## Cloudflare WAF hardening (recommended)

The KV login throttle is a best-effort application safeguard; KV is eventually consistent and is not a strict, globally coordinated rate limiter. For edge enforcement, create a Cloudflare **Rate limiting rule** for the hostname serving the panel:

1. In the Cloudflare dashboard, open **Security → WAF → Rate limiting rules** (the menu and availability can vary by plan).
2. Match login submissions with this expression, replacing the hostname with the panel's public hostname:
   ```text
   http.host eq "panel.example.com" and http.request.method eq "POST" and ends_with(http.request.uri.path, "/login/authenticate")
   ```
   The suffix deliberately avoids hard-coding the configured `securePath` segment. If multiple apps share this hostname, additionally scope the expression to the Worker route/prefix.
3. Use the source IP as the counting characteristic. A conservative starting point is **5 requests per 10 minutes per IP**, with **Block for 10 minutes**; tune this for shared-NAT users and your threat model. Confirm the rule is deployed and inspect Security Events after testing a few login attempts.

Rate-limiting features and configuration options depend on the Cloudflare plan. This rule protects the login endpoint only; it does not replace strong panel credentials, and it should not be assumed to cover subscriptions or other routes.

## Getting started

- [Installation methods](https://bia-pain-bache.github.io/BPB-Worker-Panel/wizard/)
- [Configuration](https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/)
- [How to use](https://bia-pain-bache.github.io/BPB-Worker-Panel/usage/)
- [FAQ](https://bia-pain-bache.github.io/BPB-Worker-Panel/faq/)

## Supported Clients

|       Client        | Minimum version |  Fragment support  |  Warp Pro support  |
| :-----------------: | :-------------: | :----------------: | :----------------: |
|     **v2rayNG**     |      2.2.3      | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |       16        | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      |     7.22.5      | :heavy_check_mark: | :heavy_check_mark: |
|    **Streisand**    |     1.6.71      | :heavy_check_mark: | :heavy_check_mark: |
|    **Sing-box**     |     1.12.0      | :heavy_check_mark: |        :x:         |
|      **husi**       |      1.3.2      | :heavy_check_mark: |        :x:         |
|   **Clash Meta**    |                 |        :x:         | :heavy_check_mark: |
| **Clash Verge Rev** |                 |        :x:         | :heavy_check_mark: |
|     **FLClash**     |                 |        :x:         | :heavy_check_mark: |
|    **Wireguard**    |                 |        :x:         |        :x:         |
|   **AmneziaVPN**    |                 |        :x:         | :heavy_check_mark: |
|    **WG Tunnel**    |                 |        :x:         | :heavy_check_mark: |

---

### Special Thanks

- VLESS, Trojan [Cloudflare-workers/pages proxy script](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) by [yonggekkk](https://github.com/yonggekkk)
- CF-vless code author [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF preferred IP program author [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)
