/**
 * Dashboard domain — presentation contracts, section adapters and the data
 * service. Public surface of the module (imports stay `@/lib/dashboard`).
 */

export type {
  ActivityEntry,
  DashboardAction,
  DashboardActionIcon,
  DashboardData,
  DashboardStat,
  ReactivityStat,
  UserSummary,
} from "./contracts";
export { fetchDashboardData } from "./service";
