/**
 * Applications domain — presentation contracts, status adapters and the data
 * service. Public surface of the module (imports stay `@/lib/applications`).
 */

export { STATUS_META } from "./adapters";
export type {
  ApplicationEntry,
  ApplicationListingInfo,
  ApplicationsData,
  ApplicationsFilter,
  ApplicationsFilterOption,
} from "./contracts";
export { APPLICATION_FILTERS } from "./contracts";
export { fetchApplicationsData } from "./service";
