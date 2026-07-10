import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_TTL_MS,
  adminPassword,
  createSessionValue,
  timingSafeEqual,
} from "@/lib/admin/auth";
import { clientIp, rateLimit, rateLimitReset } from "@/lib/admin/rate-limit";

export const runtime = "nodejs";

/** 8 wrong guesses per IP per 10 minutes, then the door closes for a while. */
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(req: Request) {
  const key = `login:${clientIp(req)}`;

  const limit = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password : "";

  if (!timingSafeEqual(password, adminPassword())) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  // Correct password — don't let earlier typos count against this IP.
  rateLimitReset(key);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}
