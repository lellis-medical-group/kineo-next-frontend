/**
 * Applications domain — presentation contracts, status adapters and the data
 * service. Public surface of the module (imports stay `@/lib/applications`).
 */

export {
  LISTING_FALLBACK_TITLE,
  STATUS_META,
} from "./adapters";
export type {
  ApplicationEntry,
  ApplicationListingInfo,
  ApplicationsData,
  ApplicationsFilter,
  ApplicationsFilterOption,
} from "./contracts";
export { APPLICATION_FILTERS } from "./contracts";
export type { PaginationParams } from "./service";
export { fetchApplicationDetail, fetchApplicationsData } from "./service";
