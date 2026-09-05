export { getSessionCookie } from "better-auth/cookies";

/**
 * Cookie names of the backend Better-Auth instance
 * (kineo-nest-backend/src/lib/auth.ts keeps the library defaults:
 * prefix "better-auth", no custom cookie names).
 *
 * - `session_token`: the server-side session identifier. Presence can be
 *   checked optimistically (`getSessionCookie`) — the session itself is
 *   validated by the backend on every API call.
 * - `session_data`: signed short-lived session cache (backend `cookieCache`,
 *   5 min). Backend-only by design: decoding it (`getCookieCache`) requires
 *   BETTER_AUTH_SECRET, which the frontend intentionally never holds.
 *
 * In production the cookies are prefixed `__Secure-`; `getSessionCookie`
 * handles both spellings.
 */
export const SESSION_COOKIE = "better-auth.session_token";
export const SESSION_CACHE_COOKIE = "better-auth.session_data";
