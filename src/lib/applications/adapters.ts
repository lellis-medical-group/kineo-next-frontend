/**
 * Adapters — turn raw API payloads into the presentation contracts of
 * `./contracts`, including French status labels and badge tones.
 */

import type { BadgeTone } from "@/components/atoms/badge";
import { formatDateRange, formatRelativeTime } from "../format";
import type { ApiApplication, ApplicationStatus } from "../types/api";
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

/** Statuses open to withdrawal — the backend 400s on decided/withdrawn ones. */
export const WITHDRAWABLE_STATUSES: ReadonlySet<ApplicationStatus> = new Set([
  "PENDING",
  "SHORTLISTED",
]);

/** Label shown when the targeted listing no longer resolves. */
export const LISTING_FALLBACK_TITLE = "Titre d'annonce indisponible";

/**
 * Resolves an application's listing from the data embedded server-side — no
 * extra fetches, works for listings hidden to the user.
 */
export function adaptListingInfo(
  application: ApiApplication,
): ApplicationListingInfo {
  const embedded = application.listing;

  if (!embedded) {
    // Legacy response without the embedded listing — nothing else to show.
    return { id: application.listingId, title: LISTING_FALLBACK_TITLE };
  }

  return {
    id: embedded.id,
    title: embedded.title,
    dateRange: formatDateRange(embedded.startDate, embedded.endDate),
    description: embedded.description?.trim() || undefined,
    practiceName: embedded.practice.name,
    practiceCity: embedded.practice.city,
  };
}

export function adaptApplicationEntry(
  application: ApiApplication,
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
    listing: adaptListingInfo(application),
  };
}
