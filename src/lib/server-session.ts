import { headers } from "next/headers";
import { cache } from "react";
import { getSessionCookie } from "./auth";

export interface ServerSessionUser {
  name?: string;
}

/** Resolves server-side session for RSC pages. */
export const fetchServerSession = cache(
  async (): Promise<ServerSessionUser | null> => {
    const requestHeaders = await headers();

    // Anonymous: no session cookie, skip network round trip.
    if (!getSessionCookie(requestHeaders)) {
      return null;
    }

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
      if (!response.ok) return null;

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
