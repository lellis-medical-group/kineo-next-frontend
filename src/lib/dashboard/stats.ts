import { formatDateRange, plural } from "../format";
import type { ApiApplication, ApiReplacementListing } from "../types/api";
import type { DashboardStat } from "./contracts";

export function adaptStats(
  listings: ApiReplacementListing[],
  applications: ApiApplication[],
): DashboardStat[] {
  const open = listings.filter((l) => l.status === "OPEN").length;
  const discussion = listings.filter((l) => l.status === "DISCUSSION").length;
  // Applications SENT by the user (source: /applications/mine).
  const pendingApps = applications.filter((a) => a.status === "PENDING").length;
  // viewedAt is set when the practice views the application.
  const unseenApps = applications.filter(
    (a) => !a.viewedAt && a.status === "PENDING",
  ).length;

  const now = new Date();
  const upcoming = listings
    .filter((l) => new Date(l.startDate) > now && l.status !== "CANCELLED")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )[0];

  const activeListings = open + discussion;
  const nextReplacement: DashboardStat = upcoming
    ? {
        id: "next-replacement",
        title: "Prochain remplacement",
        value: formatDateRange(upcoming.startDate, upcoming.endDate),
        label: "période à couvrir par un remplaçant",
        detail: upcoming.title,
        icon: "calendar",
      }
    : {
        id: "next-replacement",
        title: "Prochain remplacement",
        value: "Aucun",
        label: "aucune période à couvrir",
        detail: "Publiez une annonce pour trouver un remplaçant",
        icon: "calendar",
      };

  return [
    {
      id: "listings",
      title: "Mes annonces",
      value: `${activeListings}`,
      label: `annonce${plural(activeListings)} active${plural(activeListings)} · en recherche de remplaçant`,
      detail:
        open > 0 || discussion > 0
          ? `${open} ouverte${plural(open)} · ${discussion} en discussion`
          : undefined,
      icon: "layers",
    },
    {
      id: "applications",
      title: "Mes candidatures",
      value: `${pendingApps}`,
      label: `candidature${plural(pendingApps)} envoyée${plural(pendingApps)} · en attente de réponse du cabinet`,
      detail:
        unseenApps > 0
          ? `dont ${unseenApps} pas encore vue${plural(unseenApps)} par le cabinet`
          : undefined,
      icon: "users",
    },
    nextReplacement,
  ];
}
