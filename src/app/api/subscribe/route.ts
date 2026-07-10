import { NextResponse } from "next/server";
import { addSubscriber, isValidEmail, normalizeEmail } from "@/lib/admin/subscribers";
import { clientIp, rateLimit } from "@/lib/admin/rate-limit";

export const runtime = "nodejs";

/** Public and unauthenticated, so it needs a ceiling. */
const MAX_PER_HOUR = 20;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const limit = rateLimit(`subscribe:${clientIp(req)}`, MAX_PER_HOUR, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many sign-ups from this address. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await addSubscriber(email);
  } catch {
    return NextResponse.json({ error: "Could not save your email. Try again." }, { status: 500 });
  }

  // Always the same response whether or not the address was already on the list —
  // a different answer would let anyone test who has subscribed.
  return NextResponse.json({ ok: true });
}
