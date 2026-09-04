/**
 * Navigation structurelle de l'application — distincte du contenu éditorial
 * marketing (`lib/marketing.ts`). Consommée par les organismes de header.
 */

export interface HeaderLink {
  label: string;
  href: string;
}

export const publicNav: HeaderLink[] = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Comment ça marche", href: "#" },
  { label: "Tarifs", href: "#" },
];

export const memberNav: HeaderLink[] = [
  // Routes restent en anglais (convention projet), libellés en français.
  { label: "Annonces", href: "/listings" },
  { label: "Cabinets", href: "/practices" },
  { label: "Mes candidatures", href: "/applications" },
  { label: "Mon Profil", href: "/profile" },
];
