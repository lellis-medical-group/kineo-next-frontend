import { formatRelativeTime } from "../format";
import type { ApiApplication, ApiReplacementListing } from "../types/api";
import type { ActivityEntry } from "./contracts";

export function adaptActivity(
  applications: ApiApplication[],
  listings: ApiReplacementListing[],
): ActivityEntry[] {
  const listingTitles = new Map(listings.map((l) => [l.id, l.title]));

  // The feed reflects ONLY applications sent by the user — first-person messages.
  return applications
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4)
    .map((app, i) => {
      const listingLabel =
        listingTitles.get(app.listingId) ||
        `Annonce #${app.listingId.slice(-4)}`;

      let message: ActivityEntry["message"];
      switch (app.status) {
        case "ACCEPTED":
          message = [
            { text: "Votre candidature à " },
            { text: listingLabel, bold: true },
            { text: " a été acceptée" },
          ];
          break;
        case "REJECTED":
          message = [
            { text: "Votre candidature à " },
            { text: listingLabel, bold: true },
            { text: " n'a pas été retenue" },
          ];
          break;
        case "WITHDRAWN":
          message = [
            { text: "Vous avez retiré votre candidature à " },
            { text: listingLabel, bold: true },
          ];
          break;
        default:
          message = [
            { text: "Candidature envoyée pour " },
            { text: listingLabel, bold: true },
          ];
      }

      return {
        id: `act-${i + 1}`,
        icon:
          app.status === "ACCEPTED" ? ("check" as const) : ("file" as const),
        message,
        timestamp: formatRelativeTime(app.createdAt),
        href: "/applications",
      };
    });
}
