/**
 * Applications data service — fetches the user's own applications and
 * enriches them with the listings (and practices) they point at.
 * Soft 404s: an empty application list, a deleted listing or a missing
 * practice are expected states, not errors.
 */

import { apiFetch, notFoundAs } from "../api-client";
import type {
  ApiApplication,
  ApiApplicationStatusCounts,
  ApiPaginated,
  ApiPractice,
  ApiReplacementListing,
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

async function fetchListing(id: string): Promise<ApiReplacementListing | null> {
  return apiFetch<ApiReplacementListing>(`/replacement-listings/${id}`).catch(
    notFoundAs(null),
  );
}

async function fetchPractice(id: string): Promise<ApiPractice | null> {
  return apiFetch<ApiPractice>(`/practices/${id}`).catch(notFoundAs(null));
}

/** Builds an id → value map, dropping the null (soft-404) results. */
function toMap<T>(
  ids: string[],
  results: ReadonlyArray<T | null>,
): Map<string, T> {
  const map = new Map<string, T>();
  ids.forEach((id, index) => {
    const value = results[index];
    if (value) {
      map.set(id, value);
    }
  });
  return map;
}

/**
 * GET /applications/{id} — one application enriched with its listing and
 * practice. Unlike the list, a 404 here is a real error (unknown or foreign
 * id) and propagates to the caller.
 */
export async function fetchApplicationDetail(
  id: string,
): Promise<ApplicationEntry> {
  const application = await apiFetch<ApiApplication>(`/applications/${id}`);

  const listing = await fetchListing(application.listingId);
  const listingMap = toMap([application.listingId], [listing]);

  const resolved = listingMap.get(application.listingId);
  const practiceMap = resolved
    ? toMap([resolved.practiceId], [await fetchPractice(resolved.practiceId)])
    : new Map<string, ApiPractice>();

  return adaptApplicationEntry(application, listingMap, practiceMap);
}

export async function fetchApplicationsData(
  params: PaginationParams = { page: 1, limit: 2 },
): Promise<ApplicationsData> {
  const { applications, meta } = await fetchMyApplications(params);

  const listingIds = [...new Set(applications.map((a) => a.listingId))];
  const listingMap = toMap(
    listingIds,
    await Promise.all(listingIds.map(fetchListing)),
  );

  const practiceIds = [
    ...new Set([...listingMap.values()].map((l) => l.practiceId)),
  ];
  const practiceMap = toMap(
    practiceIds,
    await Promise.all(practiceIds.map(fetchPractice)),
  );

  const entries: ApplicationEntry[] = applications
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((application) =>
      adaptApplicationEntry(application, listingMap, practiceMap),
    );

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
