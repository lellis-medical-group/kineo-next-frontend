/**
 * Types bruts renvoyés par l'API (calqués sur templates/api.json).
 * Séparés des types de présentation de lib/dashboard.ts.
 */

export interface ApiProfile {
  id: string;
  userId: string;
  specialty:
    | "GENERALIST"
    | "DENTIST"
    | "DERMATOLOGIST"
    | "PSYCHIATRIST"
    | "OTHER";
  profileType: "INSTALLED" | "REPLACEMENT" | "BOTH";
  rppsNumber?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPractice {
  id: string;
  profileId: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReplacementListingStatus =
  | "DRAFT"
  | "OPEN"
  | "DISCUSSION"
  | "FILLED"
  | "CLOSED"
  | "CANCELLED";

export interface ApiReplacementListing {
  id: string;
  practiceId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: ReplacementListingStatus;
  remuneration?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface ApiApplication {
  id: string;
  listingId: string;
  applicantId: string;
  status: ApplicationStatus;
  message?: string;
  rejectionReason?: string;
  withdrawnReason?: string;
  viewedAt?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPaginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
