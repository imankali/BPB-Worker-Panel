import { HttpStatus, respond } from '@common';
import { SignJWT, jwtVerify } from 'jose';
import { getGlobals } from '@settings';

export function logout(): Response {
    return respond(true, HttpStatus.OK, 'Successfully logged out!', null, {
        'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain'
    });
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
    if (username !== accEmail || typeof data.password !== 'string' || data.password !== savedPass) {
        if (!await recordFailure()) {
            return respond(false, HttpStatus.SERVICE_UNAVAILABLE, 'Login protection is temporarily unavailable. Retry shortly.', null, { 'Retry-After': '1' });
        }
        return respond(false, HttpStatus.UNAUTHORIZED, 'Wrong Credentials.');
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

    const data = await request.json() as any;
    const { accEmail } = getGlobals();
    const username = data.username?.trim().toLowerCase();

    if (!auth && !username) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Missing username.');
    }

    if (username && username !== accEmail) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Wrong username.');
    }

    if (data.password === oldPwd) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Please enter a new Password.');
    }

    await env.kv.put('pwd', data.password);

    return respond(true, HttpStatus.OK, 'Successfully logged in!', null, {
        'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain',
    });
}