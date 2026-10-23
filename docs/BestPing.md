# Best Ping and client probe behavior

Best Ping is an HTTP reachability/latency signal, not a throughput, packet-loss, or long-duration stability test. A 204 endpoint is small and useful for latency checks, but a low result does not prove that sustained proxy traffic works on a given Iranian carrier or Wi-Fi network. Test real traffic separately on the device and operator you intend to use.

The configured URL is embedded in generated client configs and probed by the client, not fetched by the Worker diagnostics endpoint. Use a stable HTTPS endpoint on port 443 that is reachable from the clients. It should return a successful 2xx response without redirects or an interstitial/block page. The default is `https://cp.cloudflare.com/generate_204`.

## Core differences

| Core | Probe request/configuration | Expected-status behavior |
| --- | --- | --- |
| Mihomo / Clash Meta | `url-test`; GET; interval in seconds | BPB emits `expected-status: 200-299`, so non-2xx responses fail the test on Mihomo versions that support this field. |
| sing-box | `urltest`; HEAD; interval as a duration string | The current URLTest schema has no expected-status field. BPB does not emit an undocumented option; behavior for non-2xx responses follows the selected sing-box version. |
| Xray | Observatory; GET; `probeInterval` as a duration string | Observatory does not expose an expected-status setting in this generated config. Xray versions that count any completed HTTP response as alive can report false positives for an HTTP block page (for example, 403). |

Mihomo, sing-box and Xray therefore do not guarantee identical URL-test results. A custom URL should work with both GET and HEAD, return 2xx, and not redirect. For Xray in particular, do not interpret a healthy Observatory result as proof the status was 2xx. Verify the generated config and behavior with the actual client/core version in use; JSON parsing alone is not a substitute for testing supported binaries.

## References

- [Mihomo URL-test](https://wiki.metacubex.one/en/config/proxy-groups/url-test/) and [expected-status](https://wiki.metacubex.one/en/config/proxy-groups/)
- [sing-box URLTest configuration](https://sing-box.sagernet.org/configuration/outbound/urltest/)
- [Xray Observatory configuration](https://xtls.github.io/en/config/observatory.html)
- [Xray Observatory implementation](https://github.com/XTLS/Xray-core/blob/main/app/observatory/observer.go)
