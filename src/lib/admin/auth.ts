/**
 * Minimal, dependency-free admin auth: a password login that issues an
 * HMAC-signed, http-only session cookie. Uses Web Crypto so the same code runs
 * in Edge middleware (verify) and Node route handlers (sign).
 *
 * Configure via env (see .env.example):
 *   ADMIN_PASSWORD        – the login password (default "admin" for local dev)
 *   ADMIN_SESSION_SECRET  – HMAC signing secret (set a strong value in prod)
 */

export const COOKIE_NAME = "aether_admin";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "aether-dev-secret-change-me"
  );
}

const encoder = new TextEncoder();

async function hmacHex(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function encodePayload(obj: unknown): string {
  return btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodePayload(s: string): unknown {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(b64));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Build a signed session cookie value. */
export async function createSessionValue(): Promise<string> {
  const payload = encodePayload({ exp: Date.now() + SESSION_TTL_MS });
  const sig = await hmacHex(payload);
  return `${payload}.${sig}`;
}

/** Verify a session cookie value: signature valid AND not expired. */
export async function verifySession(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = await hmacHex(payload);
  if (!timingSafeEqual(sig, expected)) return false;
  try {
    const data = decodePayload(payload) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}
