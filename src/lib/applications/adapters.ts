/**
 * Adapters — turn raw API payloads into the presentation contracts of
 * `./contracts`, including French status labels and badge tones.
 */

import type { BadgeTone } from "@/components/atoms/badge";
import { formatDateRange, formatRelativeTime } from "../format";
import type {
  ApiApplication,
  ApiPractice,
  ApiReplacementListing,
  ApplicationStatus,
} from "../types/api";
import type { ApplicationEntry, ApplicationListingInfo } from "./contracts";

export interface ApplicationStatusMeta {
  label: string;
  badgeTone: BadgeTone;
}

/** French labels + badge tone per API status. */
export const STATUS_META: Record<ApplicationStatus, ApplicationStatusMeta> = {
  PENDING: { label: "En attente", badgeTone: "warning" },
  SHORTLISTED: { label: "Présélectionnée", badgeTone: "info" },
  ACCEPTED: { label: "Acceptée", badgeTone: "success" },
  REJECTED: { label: "Rejetée", badgeTone: "danger" },
  WITHDRAWN: { label: "Retirée", badgeTone: "neutral" },
};

/** Label shown when the targeted listing no longer resolves. */
export const LISTING_FALLBACK_TITLE = "Titre d'annonce indisponible";

/** Resolves the listing (and its practice) an application points at. */
export function adaptListingInfo(
  application: ApiApplication,
  listings: ReadonlyMap<string, ApiReplacementListing>,
  practices: ReadonlyMap<string, ApiPractice>,
): ApplicationListingInfo {
  const listing = listings.get(application.listingId);
  const practice = listing ? practices.get(listing.practiceId) : undefined;

  return {
    id: application.listingId,
    title: listing?.title ?? LISTING_FALLBACK_TITLE,
    dateRange: listing
      ? formatDateRange(listing.startDate, listing.endDate)
      : undefined,
    remuneration: listing?.remuneration,
    description: listing?.description?.trim() || undefined,
    practiceName: practice?.name,
    practiceCity: practice?.city,
  };
}

export function adaptApplicationEntry(
  application: ApiApplication,
  listings: ReadonlyMap<string, ApiReplacementListing>,
  practices: ReadonlyMap<string, ApiPractice>,
): ApplicationEntry {
  const message = application.message?.trim();

  return {
    id: application.id,
    status: application.status,
    createdAt: application.createdAt,
    submittedLabel: `Postulé ${formatRelativeTime(application.createdAt)}`,
    viewed: Boolean(application.viewedAt),
    message: message || undefined,
    rejectionReason: application.rejectionReason?.trim() || undefined,
    withdrawnReason: application.withdrawnReason?.trim() || undefined,
    viewedAt: application.viewedAt,
    respondedAt: application.respondedAt,
    listing: adaptListingInfo(application, listings, practices),
  };
}
