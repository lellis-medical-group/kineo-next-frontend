import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Edge privacy headers for the account-deletion confirmation page.
 *
 * Note on Cache-Control: Next.js reserves it for page responses (always
 * `no-cache, must-revalidate` on dynamic routes) and neither `headers()`
 * nor this middleware can override it. Harmless here: the page body never
 * contains the token (read client-side from the URL), so no-referrer +
 * no-index + forced revalidation cover the leak vectors.
 */
const GOODBYE_HEADERS = {
  // The URL carries a single-use token from the email link: never leak it
  // through the Referer, never let it be indexed.
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/goodbye") {
    // Applies after Next's own page headers, so Cache-Control is not overridden.
    return NextResponse.next({ headers: GOODBYE_HEADERS });
  }

  // Optimistic auth guard: redirects to /signin when no session cookie is
  // present.
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/applications",
    "/applications/:path*",
    "/goodbye",
  ],
};
