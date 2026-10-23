import { HttpStatus, respond } from '@common';
import { SignJWT, jwtVerify } from 'jose';
import { getGlobals } from '@settings';

export function logout(): Response {
    return respond(true, HttpStatus.OK, 'Successfully logged out!', null, {
        'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain'
    });
}

const PASSWORD_HASH_ALGO = 'pbkdf2';
const PASSWORD_HASH_ITERATIONS = 100_000;
const MAX_PASSWORD_HASH_ITERATIONS = 5_000_000;

function bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
    return Uint8Array.from(atob(value), char => char.charCodeAt(0));
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
}

async function derivePasswordKey(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array<ArrayBuffer>> {
    const material = await crypto.subtle.importKey('raw', Uint8Array.from(new TextEncoder().encode(password)), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, 256);
    return new Uint8Array(bits);
}

function isHashedPassword(stored: string): boolean {
    return stored.startsWith(`${PASSWORD_HASH_ALGO}$`);
}

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await derivePasswordKey(password, salt, PASSWORD_HASH_ITERATIONS);
    return `${PASSWORD_HASH_ALGO}$${PASSWORD_HASH_ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(key)}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
    if (typeof password !== 'string' || typeof stored !== 'string' || !stored) return false;

    if (!isHashedPassword(stored)) {
        // Legacy plaintext entry from older releases; migrated to a hash on the next successful login.
        return timingSafeEqualBytes(new TextEncoder().encode(password), new TextEncoder().encode(stored));
    }

    const parts = stored.split('$');
    if (parts.length !== 4 || parts[0] !== PASSWORD_HASH_ALGO) return false;

    const iterations = Number(parts[1]);
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > MAX_PASSWORD_HASH_ITERATIONS) return false;

    let salt: Uint8Array<ArrayBuffer>;
    let expected: Uint8Array<ArrayBuffer>;
    try {
        salt = base64ToBytes(parts[2]);
        expected = base64ToBytes(parts[3]);
    } catch {
        return false;
    }

    const actual = await derivePasswordKey(password, salt, iterations);
    return timingSafeEqualBytes(actual, expected);
}

export async function generateJWTToken(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    const { accEmail, accID } = getGlobals();
    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${accID}:${clientIp}`));
    const ipHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    // KV is best-effort, not atomic/global; configure an edge WAF rule for strict enforcement.
    const rateLimitKey = `auth:login:${ipHash}`;
    const storedAttempts = Number(await env.kv.get(rateLimitKey) || 0);
    const attempts = Number.isFinite(storedAttempts) ? Math.max(0, storedAttempts) : 0;
    const maxAttempts = 8;
    const windowSeconds = 600;

    if (attempts >= maxAttempts) {
        return respond(false, HttpStatus.TOO_MANY_REQUESTS, 'Too many failed login attempts. Wait 10 minutes and try again.', null, { 'Retry-After': String(windowSeconds) });
    }

    const recordFailure = async () => {
        try {
            await env.kv.put(rateLimitKey, String(attempts + 1), { expirationTtl: windowSeconds });
            return true;
        } catch {
            // KV's per-key write rate can reject rapid attempts. Fail closed for this request.
            return false;
        }
    };
    let data: any;
    try {
        const contentLength = Number(request.headers.get('Content-Length') || 0);
        if (contentLength > 4096) throw new Error('Login payload too large');
        const body = await readBoundedBody(request, 4096);
        data = JSON.parse(body);
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid login payload');
    } catch {
        if (!await recordFailure()) {
            return respond(false, HttpStatus.SERVICE_UNAVAILABLE, 'Login protection is temporarily unavailable. Retry shortly.', null, { 'Retry-After': '1' });
        }
        return respond(false, HttpStatus.BAD_REQUEST, 'Invalid login request.');
    }

    const savedPass = await env.kv.get('pwd');
    const username = typeof data.username === 'string' ? data.username.trim().toLowerCase() : '';
    const password = typeof data.password === 'string' ? data.password : '';
    const isPasswordValid = await verifyPassword(password, savedPass);
    if (username !== accEmail || !isPasswordValid) {
        if (!await recordFailure()) {
            return respond(false, HttpStatus.SERVICE_UNAVAILABLE, 'Login protection is temporarily unavailable. Retry shortly.', null, { 'Retry-After': '1' });
        }
        return respond(false, HttpStatus.UNAUTHORIZED, 'Wrong Credentials.');
    }

    if (savedPass && !isHashedPassword(savedPass)) {
        await env.kv.put('pwd', await hashPassword(password));
    }

    await env.kv.delete(rateLimitKey);

    let secretKey = await env.kv.get('secretKey');
    if (!secretKey) {
        secretKey = generateSecretKey();
        await env.kv.put('secretKey', secretKey);
    }

    const secret = new TextEncoder().encode(secretKey);
    const jwtToken = await new SignJWT({ id: accID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

    return respond(true, HttpStatus.OK, 'Successfully generated Auth token', null, {
        'Set-Cookie': `jwtToken=${jwtToken}; Path=/; HttpOnly; Secure; Max-Age=${24 * 60 * 60}; SameSite=Strict`,
        'Content-Type': 'text/plain',
    });
}

async function readBoundedBody(request: Request, maxBytes: number): Promise<string> {
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Missing request body');
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (!value) continue;
            totalBytes += value.byteLength;
            if (totalBytes > maxBytes) {
                await reader.cancel();
                throw new Error('Login payload too large');
            }
            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function generateSecretKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);

    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function authenticate(request: Request, env: Env): Promise<boolean> {
    try {
        const secretKey = await env.kv.get('secretKey');
        if (secretKey === null) {
            console.log('Secret key not found in KV.');
            return false;
        }

        const secret = new TextEncoder().encode(secretKey);
        const cookie = request.headers.get('Cookie')?.match(/(^|;\s*)jwtToken=([^;]*)/);
        const token = cookie ? cookie[2] : null;
        if (!token) {
            console.log('Unauthorized: Token not available!');
            return false;
        }

        const { payload } = await jwtVerify(token, secret);
        console.log(`Successfully authenticated, User ID: ${payload.id}`);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function resetPassword(request: Request, env: Env): Promise<Response> {
    const auth = await authenticate(request, env);
    const oldPwd = await env.kv.get('pwd');
    if (oldPwd && !auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized.');
    }

    let data: any;
    try {
        const body = await readBoundedBody(request, 4096);
        data = JSON.parse(body);
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid payload');
    } catch {
        return respond(false, HttpStatus.BAD_REQUEST, 'Invalid request.');
    }

    const { accEmail } = getGlobals();
    const username = typeof data.username === 'string' ? data.username.trim().toLowerCase() : '';

    if (!auth && !username) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Missing username.');
    }

    if (username && username !== accEmail) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Wrong username.');
    }

    const newPassword = data.password;
    if (typeof newPassword !== 'string' || newPassword.length < 1 || newPassword.length > 256) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Invalid password.');
    }

    if (await verifyPassword(newPassword, oldPwd)) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Please enter a new Password.');
    }

    await env.kv.put('pwd', await hashPassword(newPassword));
    // Invalidate outstanding sessions so old JWTs cannot outlive the password change.
    await env.kv.delete('secretKey');

    return respond(true, HttpStatus.OK, 'Successfully logged in!', null, {
        'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain',
    });
}