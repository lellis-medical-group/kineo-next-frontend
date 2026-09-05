import { headers } from "next/headers";
import { cache } from "react";
import { getSessionCookie } from "./auth";

export interface ServerSessionUser {
  /** Display name — may be empty; components fall back to a generic greeting. */
  name?: string;
}

/**
 * Server-side session resolution for RSC pages.
 *
 * The Better-Auth instance lives in the backend (kineo-nest-backend) and the
 * frontend deliberately never holds BETTER_AUTH_SECRET, so the session cannot
 * be validated locally (`getCookieCache` requires the secret). Instead, the
 * incoming cookies are forwarded to the backend's `get-session` endpoint,
 * which performs the real validation.
 *
 * Performance:
 * - Anonymous requests (no session cookie) short-circuit to `null` — no
 *   network call at all for public traffic.
 * - Authenticated requests call the backend directly (server-to-server) —
 *   routing through the app's own `/api/auth` proxy would add a pointless
 *   internal hop; the proxy exists for browser cross-origin/cookie concerns.
 * - `cache()` deduplicates concurrent calls within a single render pass
 *   (layout + page), per the Next.js caching guide.
 *
 * Returns null when the session is missing/expired or the backend is
 * unreachable — the same contract as the client's `useSession()` resolving
 * to null, so callers can fall back to the public experience.
 */
export const fetchServerSession = cache(
  async (): Promise<ServerSessionUser | null> => {
    const requestHeaders = await headers();

    // No session cookie → definitively anonymous, skip the network round trip.
    if (!getSessionCookie(requestHeaders)) {
      return null;
    }

    // Server-to-server: call the backend directly (same URL the /api/auth
    // proxy targets); without NEXT_PUBLIC_BACKEND_URL, fall back to the
    // app's own proxy resolved from the request host.
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const sessionURL = backendURL
      ? `${backendURL}/api/auth/get-session`
      : `${requestHeaders.get("x-forwarded-proto") ?? "http"}://${
          requestHeaders.get("host") ?? "localhost:3001"
        }/api/auth/get-session`;

    try {
      const response = await fetch(sessionURL, {
        headers: { cookie: requestHeaders.get("cookie") ?? "" },
        cache: "no-store",
      });
      if (!response.ok) {
        return null;
      }

      const session = (await response.json()) as {
        user?: { name?: string } | null;
      } | null;
      return session?.user ? { name: session.user.name } : null;
    } catch {
      // Backend unreachable — treat as unauthenticated.
      return null;
    }
  },
);
