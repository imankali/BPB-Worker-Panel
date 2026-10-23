import { connect } from 'cloudflare:sockets';
import { isIPv4, parseHostPort, resolveDNS } from '@utils';
import { getGlobals } from '@settings';
import { convertToNAT64IPv6 } from '@cores/nat64';

export const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
const CONNECT_TIMEOUT_MS = 5000;
const WRITE_TIMEOUT_MS = 5000;
const CANDIDATE_HEALTH_TTL_MS = 30 * 60 * 1000;

class SafeRetryError extends Error {}

interface CandidateHealth {
    success: number;
    failure: number;
    updatedAt: number;
}

// Per-isolate, short-lived scoring only. Nothing about destination traffic is persisted.
const candidateHealth = new Map<string, CandidateHealth>();

function recordCandidateResult(candidate: string, succeeded: boolean) {
    const now = Date.now();
    const current = candidateHealth.get(candidate);
    const health = current && now - current.updatedAt < CANDIDATE_HEALTH_TTL_MS
        ? current
        : { success: 0, failure: 0, updatedAt: now };

    if (succeeded) health.success++;
    else health.failure++;
    health.updatedAt = now;

    if (health.success + health.failure > 40) {
        health.success = Math.ceil(health.success / 2);
        health.failure = Math.ceil(health.failure / 2);
    }

    candidateHealth.set(candidate, health);
    if (candidateHealth.size > 128) {
        const oldest = [...candidateHealth.entries()].sort((a, b) => a[1].updatedAt - b[1].updatedAt)[0]?.[0];
        if (oldest) candidateHealth.delete(oldest);
    }
}

function rankCandidates(candidates: string[]): string[] {
    const now = Date.now();
    const ranked = [...new Set(candidates)].map(candidate => {
        const health = candidateHealth.get(candidate);
        const score = !health || now - health.updatedAt >= CANDIDATE_HEALTH_TTL_MS
            ? 0.5
            : (health.success + 2) / (health.success + health.failure + 4);
        return { candidate, score };
    }).sort((a, b) => b.score - a.score);

    // Randomize only exact ties; keep comparator ordering deterministic and transitive.
    for (let start = 0; start < ranked.length;) {
        let end = start + 1;
        while (end < ranked.length && ranked[end].score === ranked[start].score) end++;
        for (let index = end - 1; index > start; index--) {
            const swapIndex = start + Math.floor(Math.random() * (index - start + 1));
            [ranked[index], ranked[swapIndex]] = [ranked[swapIndex], ranked[index]];
        }
        start = end;
    }

    return ranked.map(item => item.candidate);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => {
            timer = setTimeout(() => reject(new Error(message)), timeoutMs);
        })
    ]).finally(() => clearTimeout(timer!));
}

export async function writeSocketData(socket: Socket, data: ArrayBuffer | Uint8Array): Promise<void> {
    const writer = socket.writable.getWriter();
    try {
        await withTimeout(writer.write(data), WRITE_TIMEOUT_MS, 'TCP write timeout');
    } finally {
        writer.releaseLock();
    }
}

export async function handleTCPOutBound(
    remoteSocket: { value: Socket | null; sentData?: boolean },
    addressRemote: string,
    portRemote: number,
    rawClientData: ArrayBuffer | undefined,
    webSocket: WebSocket,
    VLResponseHeader: Uint8Array<ArrayBuffer> | null,
    log: Function
) {
    remoteSocket.sentData = false;

    async function connectAndWrite(address: string, port: number): Promise<Socket> {
        // if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) address = `${atob('d3d3Lg==')}${address}${atob('LnNzbGlwLmlv')}`;
        let tcpSocket: Socket;
        try {
            tcpSocket = connect({ hostname: address, port });
        } catch (error) {
            throw new SafeRetryError('TCP connection failed');
        }

        remoteSocket.value = tcpSocket;
        try {
            await withTimeout(tcpSocket.opened, CONNECT_TIMEOUT_MS, 'TCP connect timeout');
        } catch (error) {
            if (remoteSocket.value === tcpSocket) remoteSocket.value = null;
            await tcpSocket.close().catch(() => { });
            throw new SafeRetryError('TCP connection failed');
        }

        log('TCP connection established');
        try {
            if (rawClientData?.byteLength) {
                remoteSocket.sentData = true;
                await writeSocketData(tcpSocket, rawClientData);
            }
            return tcpSocket;
        } catch (error) {
            if (remoteSocket.value === tcpSocket) remoteSocket.value = null;
            await tcpSocket.close().catch(() => { });
            throw error;
        }
    }

    async function retry() {
        if (webSocket.readyState !== WS_READY_STATE_OPEN) return;
        const { proxyIpMode, proxyIPs, prefixes } = getGlobals();
        const candidates = rankCandidates(proxyIpMode === 'prefix' ? prefixes : proxyIPs).slice(0, 3);

        for (const [index, candidate] of candidates.entries()) {
            if (webSocket.readyState !== WS_READY_STATE_OPEN) return;
            let targetAddr = addressRemote;
            let targetPort = portRemote;

            try {
                if (proxyIpMode === 'proxyip') {
                    log(`direct connection failed; trying Proxy IP candidate ${index + 1}/${candidates.length}`);
                    const { host, port } = parseHostPort(candidate, true);
                    targetAddr = host || addressRemote;
                    targetPort = port || portRemote;
                } else if (proxyIpMode === 'prefix') {
                    log(`direct connection failed; trying NAT64 candidate ${index + 1}/${candidates.length}`);
                    const dynamicProxyIP = await getDynamicProxyIP(addressRemote, candidate);
                    if (!dynamicProxyIP) {
                        throw new Error('Invalid Prefix');
                    }
                    targetAddr = dynamicProxyIP;
                }

                const tcpSocket = await connectAndWrite(targetAddr, targetPort);
                if (webSocket.readyState !== WS_READY_STATE_OPEN) {
                    safeCloseTcpSocket(tcpSocket);
                    return;
                }
                tcpSocket.closed
                    .catch(error => console.log('Retry socket closed:', error instanceof Error ? error.name : 'unknown'))
                    .finally(() => safeCloseWebSocket(webSocket));

                let resultRecorded = false;
                const record = (succeeded: boolean) => {
                    if (resultRecorded) return;
                    resultRecorded = true;
                    recordCandidateResult(candidate, succeeded);
                };
                remoteSocketToWS(tcpSocket, webSocket, VLResponseHeader, null, log, {
                    onFirstResponse: () => record(true),
                    onNoResponse: () => record(false)
                }, remoteSocket);
                return;
            } catch (error) {
                recordCandidateResult(candidate, false);
                console.warn(`Retry candidate ${index + 1} failed:`, error instanceof Error ? error.name : 'unknown');
                if (remoteSocket.sentData) break;
            }
        }

        webSocket.close(1011, 'Retry connection failed: All ProxyIP/NAT64 candidates failed');
    }

    try {
        const tcpSocket = await connectAndWrite(addressRemote, portRemote);
        remoteSocketToWS(tcpSocket, webSocket, VLResponseHeader, retry, log, undefined, remoteSocket);
    } catch (error) {
        if (webSocket.readyState !== WS_READY_STATE_OPEN) return;
        if (error instanceof SafeRetryError && !remoteSocket.sentData) {
            console.warn('Direct TCP connect failed before sending client data; trying configured fallback routes.');
            await retry();
        } else {
            console.warn('Direct outbound failed after client data may have been sent; not replaying the stream.');
            webSocket.close(1011, 'Outbound connection failed');
        }
    }
}

async function remoteSocketToWS(
    remoteSocket: Socket,
    webSocket: WebSocket,
    VLResponseHeader: Uint8Array<ArrayBuffer> | null,
    retry: Function | null,
    log: Function,
    healthCallbacks?: { onFirstResponse: () => void; onNoResponse: () => void },
    socketRef?: { value: Socket | null; sentData?: boolean }
) {
    let vlHeader = VLResponseHeader;
    let hasIncomingData = false;

    const writableStream = new WritableStream({
        start() { },
        async write(chunk, controller) {
            if (!hasIncomingData) healthCallbacks?.onFirstResponse();
            hasIncomingData = true;
            if (webSocket.readyState !== WS_READY_STATE_OPEN) {
                controller.error('webSocket.readyState is not open, maybe close');
            }

            if (vlHeader) {
                webSocket.send(await new Blob([vlHeader, chunk]).arrayBuffer());
                vlHeader = null;
            } else {
                webSocket.send(chunk);
            }
        },
        close() {
            log(`remoteConnection.readable is close with hasIncomingData is ${hasIncomingData}`);
        },
        abort(reason) {
            console.error('Remote TCP readable stream aborted.');
            safeCloseTcpSocket(remoteSocket);
        }
    });

    try {
        // A quiet TCP peer is not necessarily dead (many application protocols wait for client data).
        // Do not impose a first-byte deadline on an established tunnel.
        await remoteSocket.readable.pipeTo(writableStream);
    } catch (error) {
        console.warn('Upstream socket stream ended:', error instanceof Error ? error.name : 'unknown');
        safeCloseTcpSocket(remoteSocket);
        if (socketRef?.value === remoteSocket) socketRef.value = null;
        if (!hasIncomingData && retry) {
            // No response was received, so the client has not received a partial reply.
            // Keep the WebSocket alive while trying a bounded fallback route.
        } else {
            safeCloseWebSocket(webSocket);
        }
    }

    if (hasIncomingData === false) {
        healthCallbacks?.onNoResponse();
        if (socketRef?.sentData) {
            if (socketRef.value === remoteSocket) socketRef.value = null;
            log('No upstream response after sending client data; stream will not be replayed.');
            safeCloseWebSocket(webSocket);
        } else if (retry && webSocket.readyState === WS_READY_STATE_OPEN) {
            if (socketRef?.value === remoteSocket) socketRef.value = null;
            log('No upstream response and no client data was sent; trying a fallback route.');
            void retry();
        }
    } else {
        if (socketRef?.value === remoteSocket) socketRef.value = null;
        safeCloseTcpSocket(remoteSocket);
        safeCloseWebSocket(webSocket);
    }
}

export function makeReadableWebSocketStream(webSocketServer: WebSocket, earlyDataHeader: string, log: Function) {
    let readableStreamCancel = false;
    const stream = new ReadableStream({
        start(controller) {
            webSocketServer.addEventListener('message', (event) => {
                if (readableStreamCancel) return;
                controller.enqueue(event.data);
            });

            webSocketServer.addEventListener('close', () => {
                safeCloseWebSocket(webSocketServer);
                if (readableStreamCancel) return;
                controller.close();
            });

            webSocketServer.addEventListener('error', (err) => {
                log('webSocketServer has error');
                controller.error(err);
            });

            const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);

            if (error) {
                controller.error(error);
            } else if (earlyData) {
                controller.enqueue(earlyData);
            }
        },
        pull(_controller) { },
        cancel(reason) {
            if (readableStreamCancel) return;
            log(`ReadableStream was canceled, due to ${reason}`);
            readableStreamCancel = true;
            safeCloseWebSocket(webSocketServer);
        }
    });

    return stream;
}

function base64ToArrayBuffer(base64Str: string) {
    if (!base64Str) {
        return { earlyData: null, error: null };
    }

    try {
        // go use modified Base64 for URL rfc4648 which js atob not support
        base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
        const decode = atob(base64Str);
        const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
        return { earlyData: arryBuffer.buffer, error: null };
    } catch (error) {
        return { earlyData: null, error };
    }
}

export function safeCloseTcpSocket(socket: Socket | null) {
    if (!socket) return;
    try {
        void socket.close().catch(error => console.error('TCP socket close failed:', error instanceof Error ? error.name : 'unknown'));
    } catch (error) {
        console.error('Failed to close TCP socket:', error);
    }
}

export function safeCloseWebSocket(socket: WebSocket) {
    try {
        if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
            socket.close();
        }
    } catch (error) {
        console.error('safeCloseWebSocket error', error);
    }
}

async function getDynamicProxyIP(address: string, prefix: string) {
    let finalAddress = address;

    if (!isIPv4(address)) {
        const { ipv4 } = await resolveDNS(address, true);

        if (ipv4.length) {
            finalAddress = ipv4[0];
        } else {
            throw new Error('Unable to find IPv4 in DNS records');
        }
    }

    return convertToNAT64IPv6(finalAddress, prefix);
}
