/**
 * Applications data service — fetches the user's own applications. The
 * backend embeds each application's listing (and its practice) directly in
 * the response, so a whole page loads in a single request and keeps working
 * for listings the user could not fetch themselves (closed, filled...).
 * Soft 404s: an empty application list is an expected state, not an error.
 */

import { apiFetch, notFoundAs } from "../api-client";
import type {
  ApiApplication,
  ApiApplicationStatusCounts,
  ApiPaginated,
} from "../types/api";
import { adaptApplicationEntry } from "./adapters";
import type { ApplicationEntry, ApplicationsData } from "./contracts";

/** Pagination parameters for fetching applications. */
export interface PaginationParams {
  page: number;
  limit: number;
  status?: string;
}

function statusCounts(total: number): ApiApplicationStatusCounts {
  return {
    total,
    PENDING: 0,
    SHORTLISTED: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };
}

async function fetchMyApplications(params: PaginationParams): Promise<{
  applications: ApiApplication[];
  meta: ApiPaginated<ApiApplication>["meta"];
}> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }

  const raw = await apiFetch<ApiPaginated<ApiApplication> | ApiApplication[]>(
    `/applications/mine?${searchParams}`,
  ).catch(notFoundAs([]));

  // Legacy shape (or soft-404): a bare array is the whole collection, so
  // counts derived from it remain stable.
  if (Array.isArray(raw)) {
    const counts = statusCounts(raw.length);
    for (const application of raw) {
      counts[application.status] += 1;
    }
    return {
      applications: raw,
      meta: {
        total: raw.length,
        page: 1,
        limit: raw.length || 1,
        totalPages: 1,
        counts,
      },
    };
  }

  if (raw && typeof raw === "object" && "data" in raw && "meta" in raw) {
    return {
      applications: raw.data,
      meta: raw.meta,
    };
  }

  return {
    applications: [],
    meta: {
      total: 0,
      page: params.page,
      limit: params.limit,
      totalPages: 0,
      counts: statusCounts(0),
    },
  };
}

/**
 * GET /applications/{id} — one application with its listing and practice
 * embedded by the backend: a single request (a 404 here is a real error,
 * unknown or foreign id, and propagates to the caller).
 */
export async function fetchApplicationDetail(
  id: string,
): Promise<ApplicationEntry> {
  const application = await apiFetch<ApiApplication>(`/applications/${id}`);
  return adaptApplicationEntry(application);
}

export async function fetchApplicationsData(
  params: PaginationParams = { page: 1, limit: 2 },
): Promise<ApplicationsData> {
  const { applications, meta } = await fetchMyApplications(params);

  // Newest submissions first — matches the backend orderBy, kept as a guard
  const entries: ApplicationEntry[] = applications
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map(adaptApplicationEntry);

  return {
    total: meta.total,
    applications: entries,
    pagination: {
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.totalPages,
    },
    // Server-computed totals — never derived from the loaded page
    counts: meta.counts ?? statusCounts(meta.total),
  };
}
