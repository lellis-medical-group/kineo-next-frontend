import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Optimistic auth guard (Better-Auth recommended proxy pattern):
 * redirects to /signin when no session cookie is present.
 *
 * `getSessionCookie` targets exactly the session cookie
 * (`better-auth.session_token`, `__Secure-` prefixed in production) — unlike a
 * loose `better-auth.*` prefix check it cannot be satisfied by unrelated
 * Better-Auth cookies (OAuth state…).
 *
 * This is a presence check only (see Better-Auth docs): the session itself is
 * validated by the backend on every API call, and pages render authenticated
 * content based on the validated session (lib/server-session.ts → 401 → error
 * state / public fallback).
 *
 * Deliberately avoids calling the backend here: when the backend is
 * temporarily unavailable, access is not blocked by mistake.
 *
 * `/` is intentionally NOT matched: it is public by design (marketing home for
 * visitors) and its member branch is decided server-side per request
 * (src/app/(site)/page.tsx) with a real session validation.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = getSessionCookie(request) !== null;

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
