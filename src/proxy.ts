import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/admin/auth";

/**
 * Gate the admin UI and admin APIs behind a valid session cookie.
 * The public storefront and /api/checkout stay open. /admin/login and the
 * /api/auth/* endpoints are intentionally not matched.
 * (Next 16 "proxy" convention — formerly middleware.)
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself through.
  if (pathname === "/admin/login") return NextResponse.next();

  const authed = await verifySession(req.cookies.get(COOKIE_NAME)?.value);
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
