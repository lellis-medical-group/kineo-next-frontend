/**
 * Applications data service — fetches the user's own applications and
 * enriches them with the listings (and practices) they point at.
 * Soft 404s: an empty application list, a deleted listing or a missing
 * practice are expected states, not errors.
 */

import { apiFetch, extractList, notFoundAs } from "../api-client";
import type {
  ApiApplication,
  ApiPaginated,
  ApiPractice,
  ApiReplacementListing,
} from "../types/api";
import { adaptApplicationEntry } from "./adapters";
import type { ApplicationEntry, ApplicationsData } from "./contracts";

async function fetchMyApplications(): Promise<ApiApplication[]> {
  const raw = await apiFetch<ApiPaginated<ApiApplication> | ApiApplication[]>(
    "/applications/mine",
  ).catch(notFoundAs([]));
  return extractList(raw);
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

export async function fetchApplicationsData(): Promise<ApplicationsData> {
  const applications = await fetchMyApplications();

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

  return { total: entries.length, applications: entries };
}
