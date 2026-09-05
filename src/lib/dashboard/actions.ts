import type { DashboardAction } from "./contracts";

/**
 * Actions proposées dès l'arrivée — une par rôle : publier une annonce
 * (cabinet) ou chercher un remplacement (remplaçant), puis le suivi.
 */
export function adaptActions(): DashboardAction[] {
  return [
    {
      label: "Publier une annonce",
      href: "/listings/new",
      variant: "primary",
      icon: "plus",
    },
    {
      label: "Chercher un remplacement",
      href: "/listings",
      variant: "outline",
      icon: "layers",
    },
    {
      label: "Voir mes candidatures",
      href: "/applications",
      variant: "outline",
      icon: "file",
    },
    { label: "Gérer mes cabinets", href: "/practices", variant: "outline" },
  ];
}
