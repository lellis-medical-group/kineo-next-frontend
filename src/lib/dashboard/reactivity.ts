import type { ApiApplication } from "../types/api";
import type { DashboardData, ReactivityStat } from "./contracts";

export function adaptReactivity(
  applications: ApiApplication[],
): DashboardData["reactivity"] {
  // All metrics are about applications SENT by the user.
  const responded = applications.filter((a) => a.respondedAt).length;
  const total = applications.length;
  const rate = total > 0 ? Math.round((responded / total) * 100) : 0;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;

  const stats: ReactivityStat[] = [
    { label: "Taux de réponse des cabinets", value: `${rate}%`, accent: true },
    { label: "Candidatures envoyées", value: `${total}` },
    { label: "Acceptées", value: `${accepted}` },
  ];

  return {
    title: "Vos candidatures, en chiffres",
    stats,
    tipTitle: "Conseil Kineo",
    tip: "Un message personnalisé fait la différence : mentionnez votre expérience et vos disponibilités dans chaque candidature pour augmenter vos chances d'acceptation.",
  };
}
