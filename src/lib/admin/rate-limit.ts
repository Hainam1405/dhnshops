/**
 * Fixed-window, in-memory rate limiter for the admin login.
 *
 * Honest about what this is: each serverless instance keeps its own Map, so an
 * attacker who spreads requests across cold instances gets more attempts than
 * the nominal limit. It is a speed bump against credential stuffing and naive
 * brute force — not a distributed quota. It needs no storage and cannot fail.
 * If you ever need a hard guarantee, move the counter into Postgres or Redis.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Bound memory so a spray of unique keys can't grow the map without limit. */
const MAX_ENTRIES = 10_000;

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

function sweepExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_ENTRIES) sweepExpired(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

/** Clear a key after a successful login, so one typo doesn't cost the real user. */
export function rateLimitReset(key: string): void {
  buckets.delete(key);
}

/** Best-effort client IP. Vercel sets x-forwarded-for; the first entry is the client. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}
