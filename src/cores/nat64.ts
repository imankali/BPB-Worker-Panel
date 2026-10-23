const RFC6052_PREFIX_LENGTHS = new Set([32, 40, 48, 56, 64, 96]);

function parseIPv6Words(address: string): number[] | null {
    const value = address.replace(/^\[|\]$/g, '');
    if (!value || value.includes('.')) return null;
    const halves = value.split('::');
    if (halves.length > 2) return null;
    const parseHalf = (half: string) => half ? half.split(':').map(word => {
        if (!/^[0-9a-f]{1,4}$/i.test(word)) throw new Error('invalid IPv6 word');
        return Number.parseInt(word, 16);
    }) : [];

    try {
        const head = parseHalf(halves[0]);
        const tail = parseHalf(halves[1] || '');
        if (halves.length === 1) return head.length === 8 ? head : null;
        const zeroWords = 8 - head.length - tail.length;
        if (zeroWords < 1) return null;
        return [...head, ...Array(zeroWords).fill(0), ...tail];
    } catch {
        return null;
    }
}

function formatIPv6Words(words: number[]): string {
    let bestStart = -1;
    let bestLength = 1;
    for (let start = 0; start < words.length;) {
        if (words[start] !== 0) {
            start++;
            continue;
        }
        let end = start;
        while (end < words.length && words[end] === 0) end++;
        if (end - start > bestLength) {
            bestStart = start;
            bestLength = end - start;
        }
        start = end;
    }

    const asHex = (word: number) => word.toString(16);
    if (bestStart < 0) return `[${words.map(asHex).join(':')}]`;
    const before = words.slice(0, bestStart).map(asHex).join(':');
    const after = words.slice(bestStart + bestLength).map(asHex).join(':');
    return `[${before}::${after}]`;
}

function parseRfc6052Prefix(prefix: string): { words: number[]; length: number } {
    const match = prefix.match(/^(\[[^\]]+\]|[^/]+)\/(\d{1,3})$/);
    if (!match) throw new Error('NAT64 CIDR must be IPv6/prefix-length, for example 64:ff9b::/96');
    const words = parseIPv6Words(match[1]);
    const length = Number(match[2]);
    if (!words || !RFC6052_PREFIX_LENGTHS.has(length)) {
        throw new Error('RFC 6052 NAT64 prefix lengths are /32, /40, /48, /56, /64, and /96');
    }

    for (let bit = length; bit < 128; bit++) {
        const word = words[Math.floor(bit / 16)];
        const bitInWord = 15 - (bit % 16);
        if ((word >> bitInWord) & 1) {
            throw new Error('NAT64 CIDR must be a network prefix with all host bits set to zero');
        }
    }

    return { words, length };
}

/**
 * Convert an IPv4 address into an RFC 6052 IPv6 address when a CIDR is supplied.
 * Bracketed legacy prefixes without a CIDR retain the historical BPB suffix
 * placement so previously saved settings keep their existing route semantics.
 */
export function convertToNAT64IPv6(ipv4Address: string, prefix: string): string {
    const octets = ipv4Address.split('.');
    if (octets.length !== 4 || octets.some(octet => !/^(?:0|[1-9][0-9]{0,2})$/.test(octet))) {
        throw new Error('Invalid IPv4 address');
    }
    const bytes = octets.map(Number);
    if (bytes.some(byte => byte > 255)) throw new Error('Invalid IPv4 address');

    if (!prefix.includes('/')) {
        const legacy = prefix.match(/^\[([0-9a-fA-F:]+::)\]$/);
        if (!legacy || legacy[1].slice(0, -2).split(':').filter(Boolean).length > 6) {
            throw new Error('Invalid legacy NAT64 prefix; use a bracketed IPv6 prefix or an RFC 6052 CIDR');
        }
        const hex = bytes.map(byte => byte.toString(16).padStart(2, '0'));
        return `[${legacy[1]}${hex[0]}${hex[1]}:${hex[2]}${hex[3]}]`;
    }

    const { words, length } = parseRfc6052Prefix(prefix);
    const result = [...words];
    const ipv4Bits = bytes.flatMap(byte => Array.from({ length: 8 }, (_, bit) => (byte >> (7 - bit)) & 1));
    let sourceBit = 0;
    const positions: number[] = [];
    if (length === 96) {
        for (let bit = 96; bit < 128; bit++) positions.push(bit);
    } else {
        for (let bit = length; bit < 64; bit++) positions.push(bit);
        for (let bit = 72; positions.length < 32; bit++) positions.push(bit);
    }

    if (positions.length !== 32) throw new Error('Invalid RFC 6052 prefix mapping');
    for (const bit of positions) {
        const wordIndex = Math.floor(bit / 16);
        const bitInWord = 15 - (bit % 16);
        const mask = 1 << bitInWord;
        result[wordIndex] = ipv4Bits[sourceBit++] ? result[wordIndex] | mask : result[wordIndex] & ~mask;
    }

    return formatIPv6Words(result);
}

export function isValidNAT64Prefix(prefix: string): boolean {
    if (prefix.includes('/')) {
        try {
            parseRfc6052Prefix(prefix);
            return true;
        } catch {
            return false;
        }
    }

    const match = prefix.match(/^\[([0-9a-fA-F:]+::)\]$/);
    if (!match || match[1].slice(0, -2).split(':').filter(Boolean).length > 6) return false;
    return parseIPv6Words(match[1]) !== null;
}
