/**
 * Presentation-layer contracts for the applications tracking page
 * (`/applications` — the locum's own sent applications).
 * Components depend only on these types; the raw data is fetched and
 * adapted by the applications service (`./service`).
 */

import type {
  ApiApplicationStatusCounts,
  ApplicationStatus,
} from "@/lib/types/api";

/** Filter buckets above the list — "all" plus every application status. */
export type ApplicationsFilter = "ALL" | ApplicationStatus;

export interface ApplicationsFilterOption {
  id: ApplicationsFilter;
  label: string;
}

/** Filter row configuration — labels mirror the design template. */
export const APPLICATION_FILTERS: readonly ApplicationsFilterOption[] = [
  { id: "ALL", label: "Toutes" },
  { id: "PENDING", label: "En attente" },
  { id: "SHORTLISTED", label: "Présélectionnées" },
  { id: "ACCEPTED", label: "Acceptées" },
  { id: "REJECTED", label: "Rejetées" },
  { id: "WITHDRAWN", label: "Retirées" },
] as const;

/** The listing an application was sent to (resolved from the API listing). */
export interface ApplicationListingInfo {
  id: string;
  /** Listing title — falls back to « Annonce indisponible » when the listing is gone. */
  title: string;
  /** Formatted period — e.g. « Du 15 oct. au 30 oct. 2025 ». */
  dateRange?: string;
  remuneration?: string;
  /** Listing description — rendered on the dedicated detail page. */
  description?: string;
  practiceName?: string;
  practiceCity?: string;
}

/** One of the user's own applications — feeds both the card and the detail panel. */
export interface ApplicationEntry {
  id: string;
  status: ApplicationStatus;
  /** ISO timestamp of submission (raw, for detail rendering). */
  createdAt: string;
  /** Relative label — e.g. « Postulé hier ». */
  submittedLabel: string;
  /** True when the practice has opened the application (viewedAt set). */
  viewed: boolean;
  /** Message sent with the application, trimmed (undefined when empty). */
  message?: string;
  rejectionReason?: string;
  withdrawnReason?: string;
  viewedAt?: string;
  respondedAt?: string;
  listing: ApplicationListingInfo;
}

export interface ApplicationsData {
  /** Filtered total for the current status (drives pagination). */
  total: number;
  /** Entries sorted by most recent submission first. */
  applications: ApplicationEntry[];
  /** Pagination metadata. */
  pagination: {
    /** Current page number (1-based). */
    page: number;
    /** Number of items per page. */
    limit: number;
    /** Total number of pages. */
    totalPages: number;
  };
  /**
   * Server-computed totals over the WHOLE collection, independent of the
   * applied status filter and of the current page. The status tabs render
   * these numbers only — they are never derived from `applications`.
   */
  counts: ApiApplicationStatusCounts;
}
