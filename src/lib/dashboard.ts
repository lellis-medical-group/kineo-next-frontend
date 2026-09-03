/**
 * Presentation-layer contracts for the logged-in homepage.
 * Components depend only on these types; the raw data is fetched and
 * adapted by the dashboard service (`./dashboard-service`).
 */

import type { ButtonVariant } from "@/components/atoms/button";

export interface UserSummary {
  name: string;
  /** Warm, personalized welcome line. */
  subtitle: string;
  /** Small contextual line — e.g. "médecine générale · Paris". */
  meta?: string;
}

export type DashboardActionIcon = "plus" | "file" | "layers";

export interface DashboardAction {
  label: string;
  href: string;
  variant?: ButtonVariant;
  icon?: DashboardActionIcon;
}

export interface DashboardStat {
  id: string;
  title: string;
  /** Value displayed large — a number or a key fact. */
  value: string;
  icon: "layers" | "users" | "calendar";
  label?: string;
  detail?: string;
}

export interface ActivityEntry {
  id: string;
  icon: "users" | "check" | "star" | "file";
  message: Array<{ text: string; bold?: boolean }>;
  timestamp: string;
  href?: string;
}

export interface ReactivityStat {
  label: string;
  value: string;
  accent?: boolean;
}

export interface DashboardData {
  greeting: UserSummary;
  actions: DashboardAction[];
  stats: DashboardStat[];
  activity: ActivityEntry[];
  reactivity: {
    title: string;
    stats: ReactivityStat[];
    tipTitle: string;
    tip: string;
  };
}
