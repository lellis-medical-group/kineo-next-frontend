import { type NextRequest, NextResponse } from "next/server";

/**
 * Guard middleware: allows the request if a better-auth session cookie is
 * present, redirects to /signin otherwise.
 *
 * Deliberately avoids calling the backend here: the check relies on the same
 * cookie the client set (`better-auth.*`), consistent with the session seen
 * by the browser. When the backend is temporarily unavailable, access is not
 * blocked by mistake (actual state is checked client-side).
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("better-auth."));

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
