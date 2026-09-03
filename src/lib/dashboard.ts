/**
 * Données du tableau de bord (homepage connectée).
 *
 * Les composants de la homepage connectée dépendent uniquement de ces
 * abstractions (DIP) : aujourd'hui alimentées par un jeu de démonstration,
 * demain par un adapter branché sur les routes du backend
 * (`/replacement-listings/mine`, `/applications`, `/profile/me` — cf.
 * templates/api.json) sans changer le moindre composant de présentation.
 */

import type { BadgeTone } from "@/components/atoms/badge";
import type { ButtonVariant } from "@/components/atoms/button";

export interface UserSummary {
  name: string;
  subtitle: string;
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
  value: string;
  icon: "layers" | "users" | "calendar";
  chips?: Array<{ label: string; tone?: BadgeTone }>;
  note?: string;
}

export interface ActivityEntry {
  id: string;
  icon: "users" | "check" | "star" | "file";
  /** Segments du message ; `bold` met le segment en évidence. */
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
  greeting: { name: string; subtitle: string };
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

export const defaultDashboardData: DashboardData = {
  greeting: {
    name: "Dr. Martin",
    subtitle:
      "Ravi de vous revoir. Voici l'état de vos cabinets et vos candidatures en cours.",
  },
  actions: [
    {
      label: "Publier une annonce",
      href: "/listings/new",
      variant: "primary",
      icon: "plus",
    },
    {
      label: "Voir mes candidatures",
      href: "/applications",
      variant: "outline",
    },
    { label: "Gérer mes cabinets", href: "/practices", variant: "outline" },
  ],
  stats: [
    {
      id: "listings",
      title: "Annonces actives",
      value: "3 actives",
      icon: "layers",
      chips: [
        { label: "1 open", tone: "neutral" },
        { label: "2 discussion", tone: "danger" },
      ],
    },
    {
      id: "applications",
      title: "Candidatures",
      value: "7 en attente",
      icon: "users",
      chips: [{ label: "dont 2 nouvelles", tone: "success" }],
    },
    {
      id: "next-replacement",
      title: "Prochain remplacement",
      value: "15 Fév. - 22 Fév.",
      icon: "calendar",
      note: "Cabinet Médical des Pins",
    },
  ],
  activity: [
    {
      id: "act-1",
      icon: "users",
      message: [
        { text: "Nouvelle candidature de " },
        { text: "Dr. Clara Dubois", bold: true },
        { text: " pour Cabinet des Pins" },
      ],
      timestamp: "il y a 2 heures",
      href: "/applications",
    },
    {
      id: "act-2",
      icon: "check",
      message: [
        { text: "Candidature acceptée pour " },
        { text: "Clinique du Lac (Arcachon)", bold: true },
      ],
      timestamp: "hier",
      href: "/applications",
    },
    {
      id: "act-3",
      icon: "star",
      message: [
        { text: "Dr. Sophie Laurent", bold: true },
        { text: " s'est ajoutée en favori pour de futures gardes" },
      ],
      timestamp: "il y a 2 jours",
    },
    {
      id: "act-4",
      icon: "file",
      message: [
        { text: "Votre annonce de remplacement " },
        { text: "KIN-802", bold: true },
        { text: " a été mise à jour" },
      ],
      timestamp: "il y a 3 jours",
      href: "/listings",
    },
  ],
  reactivity: {
    title: "Indicateurs de réactivité",
    stats: [
      { label: "Taux de réponse", value: "92%", accent: true },
      { label: "Temps moyen de réponse", value: "4h" },
      { label: "Remplacements complétés", value: "12" },
    ],
    tipTitle: "Conseil Kineo",
    tip: "Les profils ayant un taux de réponse supérieur à 80% reçoivent en moyenne 2,5 fois plus de candidatures qualifiées. Répondez rapidement pour maximiser vos chances !",
  },
};
