const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_SIZE = 500;

function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function getCachedResponse(userMessage: string): string | null {
  const key = normalizeQuery(userMessage);
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.response;
}

export function setCachedResponse(userMessage: string, response: string): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }

  const key = normalizeQuery(userMessage);
  cache.set(key, { response, timestamp: Date.now() });
}
