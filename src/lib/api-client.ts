/**
 * Shared API client — base URL, typed errors, fetch helper.
 * Consumed by the domain services (dashboard, profile…).
 */

/** Backend base URL — set via NEXT_PUBLIC_BACKEND_URL (dev default: same-origin /api). */
export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

/** Typed API error — exposes HTTP status and optional NestJS business message. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    path: string,
    /** Business message from the API body, if JSON. */
    public readonly apiMessage?: string,
  ) {
    super(
      apiMessage
        ? `API ${status} (${path}): ${apiMessage}`
        : `API ${status}: ${path}`,
    );
    this.name = "ApiError";
  }
}

/**
 * Fetch with credentials. Throws typed ApiError on non-OK so callers can
 * distinguish expected states (soft 404, see `notFoundAs`) from real failures.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { headers, ...rest } = init ?? {};
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...rest,
    headers: {
      Accept: "application/json",
      ...(rest.body ? { "Content-Type": "application/json" } : undefined),
      ...headers,
    },
  });

  if (!res.ok) {
    // NestJS returns { message, error, statusCode } — surface the business message.
    let apiMessage: string | undefined;
    try {
      const body = (await res.json()) as { message?: unknown };
      if (typeof body.message === "string") {
        apiMessage = body.message;
      }
    } catch {
      // Non-JSON body (proxy, network cut) — nothing to extract.
    }
    throw new ApiError(res.status, path, apiMessage);
  }

  return res.json() as Promise<T>;
}

/** Converts an expected 404 to a fallback; other errors keep propagating. */
export function notFoundAs<T>(fallback: T) {
  return (error: unknown): T => {
    if (error instanceof ApiError && error.status === 404) {
      return fallback;
    }
    throw error;
  };
}
