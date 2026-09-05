import { headers } from "next/headers";

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
 * incoming cookies are forwarded to the app's own auth proxy
 * (`/api/auth/get-session` → backend), which performs the real validation.
 *
 * Returns null when the session is missing/expired or the backend is
 * unreachable — the same contract as the client's `useSession()` resolving
 * to null, so callers can fall back to the public experience.
 */
export async function fetchServerSession(): Promise<ServerSessionUser | null> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  if (!host) {
    return null;
  }

  // Multi-value X-Forwarded-Proto ("https, http") — keep the client scheme.
  const proto = (requestHeaders.get("x-forwarded-proto") ?? "http").split(
    ",",
  )[0];
  const origin = `${proto}://${host}`;

  try {
    const response = await fetch(`${origin}/api/auth/get-session`, {
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
}
