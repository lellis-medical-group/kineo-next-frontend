/**
 * Dashboard data service — fetches from the backend and adapts to presentation
 * types, one adapter module per section (`greeting`, `actions`, `stats`,
 * `activity`, `reactivity`).
 *
 * Single Responsibility: orchestrate API calls and transform raw data into the
 * DashboardData shape consumed by presentation components (DIP).
 */

import { apiFetch, extractList, notFoundAs } from "../api-client";
import type {
  ApiApplication,
  ApiPaginated,
  ApiProfile,
  ApiReplacementListing,
} from "../types/api";
import { adaptActions } from "./actions";
import { adaptActivity } from "./activity";
import type { DashboardData } from "./contracts";
import { adaptGreeting } from "./greeting";
import { adaptReactivity } from "./reactivity";
import { adaptStats } from "./stats";

// ── Raw data fetching ────────────────────────────────────────────────────────

/**
 * Error policy — soft 404 (expected, returns fallback) vs blocking (error screen).
 *
 * SOFT: /profile/me (documented), /replacement-listings/mine, /applications/mine.
 * BLOCKING: everything else (401/403, 5xx, unknown 404, network).
 */

/** Soft 404: profile not yet created (onboarding, see `needsProfile`). */
async function fetchProfile(): Promise<ApiProfile | null> {
  return apiFetch<ApiProfile>("/profile/me").catch(notFoundAs(null));
}

/** Soft 404: without a profile, user can't have listings. */
async function fetchMyListings(): Promise<ApiReplacementListing[]> {
  const raw = await apiFetch<
    ApiPaginated<ApiReplacementListing> | ApiReplacementListing[]
  >("/replacement-listings/mine").catch(notFoundAs([]));
  return extractList(raw);
}

/**
 * 404 soft : sans profil, l'utilisateur ne peut pas avoir de candidatures.
 */
async function fetchMyApplications(): Promise<ApiApplication[]> {
  const raw = await apiFetch<ApiPaginated<ApiApplication> | ApiApplication[]>(
    "/applications/mine",
  ).catch(notFoundAs([]));
  return extractList(raw);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetches and adapts all dashboard data. Throws on critical failure.
 * Soft 404s (see error policy above) are not errors — missing profile is
 * signaled via `needsProfile`.
 */
export async function fetchDashboardData(
  userName?: string,
): Promise<DashboardData> {
  const [profile, listings, applications] = await Promise.all([
    fetchProfile(),
    fetchMyListings(),
    fetchMyApplications(),
  ]);

  return {
    greeting: adaptGreeting(profile, userName, listings, applications),
    actions: adaptActions(),
    stats: adaptStats(listings, applications),
    activity: adaptActivity(applications, listings),
    needsProfile: profile === null,
    reactivity: adaptReactivity(applications),
  };
}
