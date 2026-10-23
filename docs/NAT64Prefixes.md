# NAT64 prefix formats

BPB accepts two deliberately distinct formats in the **NAT64 Prefixes** setting:

1. **Saved legacy BPB format** — bracketed IPv6 ending in `::`, for example `[2a02:898:146:64::]`. These values keep the historical BPB IPv4-suffix placement so existing installations do not silently change routes. This compatibility format has no explicit prefix length and is **not treated as RFC 6052**. Do not remove or rewrite `/length` information when migrating a setting.
2. **RFC 6052 format for new configurations** — IPv6 network plus CIDR length, such as `64:ff9b::/96`. Only the RFC 6052 lengths `/32`, `/40`, `/48`, `/56`, `/64`, and `/96` are accepted. The converter places the IPv4 bits according to RFC 6052, including the reserved `u` octet for prefix lengths other than `/96`.

Enter one prefix per line. CIDR prefixes must be network-aligned (all bits after the prefix length are zero). A bare unbracketed IPv6 address is rejected because its prefix length is ambiguous; the code never guesses one.

## Examples

With `192.0.2.33` as the IPv4 destination, RFC 6052 encoding yields:

| Prefix | Encoded IPv6 address |
| --- | --- |
| `2001:db8::/32` | `2001:db8:c000:221::` |
| `2001:db8:100::/40` | `2001:db8:1c0:2:21::` |
| `2001:db8:122::/48` | `2001:db8:122:c000:2:2100::` |
| `2001:db8:122:300::/56` | `2001:db8:122:3c0:0:221::` |
| `2001:db8:122:344::/64` | `2001:db8:122:344:c0:2:2100:0` |
| `64:ff9b::/96` | `64:ff9b::c000:221` |

The network must also be provisioned and routed for NAT64 by the relevant upstream. A syntactically valid RFC 6052 address does not create a NAT64 service or guarantee that the destination is reachable.

## Migration guidance

Existing saved bracketed prefixes remain valid and preserve their old output. To switch one to RFC 6052, first obtain the actual routed NAT64 prefix and its length from the provider, then explicitly replace the legacy value with that CIDR and test it on the target network. Do not mechanically append `/96` or assume that a legacy value represents `/96`; the prefix length cannot be inferred safely from legacy settings.

The implementation follows the IPv4-Embedded IPv6 Address format in [RFC 6052](https://www.rfc-editor.org/rfc/rfc6052.html). Carrier filtering, routing and prefix provisioning remain outside the panel's control.
