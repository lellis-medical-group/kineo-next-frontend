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
    /** Per-field Zod validation issues when the backend replies with { errors }. */
    public readonly fieldErrors?: ReadonlyArray<FieldError>,
  ) {
    super(
      apiMessage
        ? `API ${status} (${path}): ${apiMessage}`
        : `API ${status}: ${path}`,
    );
    this.name = "ApiError";
  }
}

/** One validation issue surfaced by the backend `{ errors: [...] }` envelope. */
export interface FieldError {
  /** Path segments pointing at the invalid field (e.g. ["city"]). */
  path: unknown[];
  message: string;
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
    // NestJS returns { message, error, statusCode } or, for Zod validation,
    // { message: "Validation failed", errors: [{ path, message }] } — surface
    // both the business message and the per-field issues.
    let apiMessage: string | undefined;
    let fieldErrors: FieldError[] | undefined;
    try {
      const body = (await res.json()) as {
        message?: unknown;
        errors?: unknown;
      };
      if (typeof body.message === "string") {
        apiMessage = body.message;
      }
      if (Array.isArray(body.errors)) {
        fieldErrors = body.errors as FieldError[];
      }
    } catch {
      // Non-JSON body (proxy, network cut) — nothing to extract.
    }
    throw new ApiError(res.status, path, apiMessage, fieldErrors);
  }

  // 204 No Content / empty body (e.g. DELETE) → no JSON to parse.
  const text = await res.text();
  if (!text) {
    return null as T;
  }
  return JSON.parse(text) as T;
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

/**
 * Normalizes API responses — handles both paginated ({ data: [], meta: {} })
 * and direct array responses. Returns a flat array.
 */
export function extractList<T>(raw: T[] | { data: T[] }): T[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "data" in raw)
    return (raw as { data: T[] }).data;
  return [];
}
