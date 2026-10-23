import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const tempDirectory = mkdtempSync(join(tmpdir(), 'bpb-tests-'));
const testBundle = join(tempDirectory, 'core-utilities.test.mjs');

globalThis.EMBEDED_SETTINGS = {
    accID: 'test-account', accEmail: 'owner@example.test', apiToken: 'test-token',
    vlUUID: '00000000-0000-4000-8000-000000000000', trPass: 'test-password',
    securePath: 'test-secret', proxyIpMode: 'proxyip', proxyIPs: ['203.0.113.2'],
    prefixes: ['[64:ff9b::]'], fallback: '', dohUrl: 'https://cloudflare-dns.com/dns-query',
    dohFallbackEnabled: false, mainDomain: 'worker.example.test'
};

try {
    await build({
        entryPoints: ['tests/core-utilities.test.ts'],
        outfile: testBundle,
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node22',
        tsconfig: 'tsconfig.json',
        external: ['node:*', 'cloudflare:sockets'],
        define: { VERSION: '"test"' }
    });
    await import(pathToFileURL(testBundle).href);
} finally {
    rmSync(tempDirectory, { recursive: true, force: true });
}
