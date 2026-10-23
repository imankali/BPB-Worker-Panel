export type ActivityLevel = 'info' | 'warning' | 'error';

export interface ActivityLogEntry {
    timestamp: string;
    level: ActivityLevel;
    event: string;
    detail: string;
}

const LOG_PREFIX = 'activity:v1:';
const RETENTION_SECONDS = 7 * 24 * 60 * 60;
const MAX_RECENT_EVENTS = 100;
const MAX_KEY_TIME = 9_999_999_999_999;

/** Store low-volume, authenticated admin events only. Never pass passwords, URLs, IPs, or DNS names. */
export async function appendActivityLog(
    env: Env,
    level: ActivityLevel,
    event: string,
    detail: string
): Promise<void> {
    const timestamp = new Date().toISOString();
    const reversedTimestamp = String(MAX_KEY_TIME - Date.now()).padStart(13, '0');
    const key = `${LOG_PREFIX}${reversedTimestamp}:${crypto.randomUUID()}`;
    const entry: ActivityLogEntry = {
        timestamp,
        level,
        event: event.slice(0, 80),
        detail: detail.slice(0, 240)
    };

    try {
        await env.kv.put(key, JSON.stringify(entry), { expirationTtl: RETENTION_SECONDS });
    } catch {
        // The panel action must not fail because an optional audit record could not be stored.
        console.error(JSON.stringify({ timestamp, level: 'error', event: 'activity-log.write-failed' }));
    }

    console.log(JSON.stringify({ timestamp, level, event: entry.event, detail: entry.detail }));
}

export async function getRecentActivityLog(env: Env): Promise<ActivityLogEntry[]> {
    const listing = await env.kv.list({ prefix: LOG_PREFIX, limit: MAX_RECENT_EVENTS });
    const names = listing.keys.map(key => key.name).sort().slice(0, MAX_RECENT_EVENTS);
    const entries = await Promise.all(names.map(name => env.kv.get<ActivityLogEntry>(name, { type: 'json' })));

    return entries
        .filter((entry): entry is ActivityLogEntry => !!entry &&
            typeof entry.timestamp === 'string' &&
            ['info', 'warning', 'error'].includes(entry.level) &&
            typeof entry.event === 'string' &&
            typeof entry.detail === 'string')
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const activityLogRetentionDays = 7;
