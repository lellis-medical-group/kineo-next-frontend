/**
 * Dashboard data service — fetches from backend and adapts to presentation types.
 *
 * Single Responsibility: orchestrate API calls and transform raw data into the
 * DashboardData shape consumed by presentation components (DIP).
 */

import { apiFetch, extractList, notFoundAs } from "./api-client";
import type {
  ActivityEntry,
  DashboardAction,
  DashboardData,
  DashboardStat,
  ReactivityStat,
} from "./dashboard";
import { formatDateRange, formatRelativeTime, plural } from "./format";
import { SPECIALTY_LABELS } from "./profile";
import type {
  ApiApplication,
  ApiPaginated,
  ApiProfile,
  ApiReplacementListing,
} from "./types/api";

// ── Raw data fetching ────────────────────────────────────────────────────────

/**
 * Error policy — soft 404 (expected, returns fallback) vs blocking (error screen).
 *
 * SOFT: /profile/me (documented), /replacement-listings/mine, /applications/mine.
 * BLOCKING: everything else (401/403, 5xx, unknown 404, network).
 */

/** Soft 404: profile not yet created (onboarding, see `needsProfile`). */
async function fetchProfile(): Promise<ApiProfile | null> {
  return apiFetch<ApiProfile>("/profile/me").catch(notFoundAs(null));
}

/** Soft 404: without a profile, user can't have listings. */
async function fetchMyListings(): Promise<ApiReplacementListing[]> {
  const raw = await apiFetch<
    ApiPaginated<ApiReplacementListing> | ApiReplacementListing[]
  >("/replacement-listings/mine").catch(notFoundAs([]));
  return extractList(raw);
}

/**
 * 404 soft : sans profil, l'utilisateur ne peut pas avoir de candidatures.
 */
async function fetchMyApplications(): Promise<ApiApplication[]> {
  const raw = await apiFetch<ApiPaginated<ApiApplication> | ApiApplication[]>(
    "/applications/mine",
  ).catch(notFoundAs([]));
  return extractList(raw);
}

// ── Adapters (raw API → presentation types) ──────────────────────────────────

function formatSpecialty(specialty: ApiProfile["specialty"]): string {
  return SPECIALTY_LABELS[specialty];
}

/**
 * Sous-titre informatif et déterministe : résume ce que la page affiche et
 * d'où viennent les chiffres (annonces publiées par l'utilisateur,
 * candidatures qu'il a envoyées). Remplace les messages d'accueil aléatoires.
 */
function adaptGreeting(
  profile: ApiProfile | null,
  userName: string | undefined,
  listings: ApiReplacementListing[],
  applications: ApiApplication[],
): DashboardData["greeting"] {
  const displayName =
    userName ||
    (profile?.rppsNumber
      ? `Dr. ${profile.rppsNumber.slice(-4)}`
      : "Professionnel");

  const meta = profile
    ? [profile.city, formatSpecialty(profile.specialty)]
        .filter(Boolean)
        .join(" · ")
    : "";

  const activeListings = listings.filter(
    (l) => l.status === "OPEN" || l.status === "DISCUSSION",
  ).length;
  const pendingApps = applications.filter((a) => a.status === "PENDING").length;

  let subtitle: string;
  if (activeListings > 0 && pendingApps > 0) {
    subtitle = `Ravi de vous revoir ! Vous avez ${activeListings} annonce${plural(activeListings)} active${plural(activeListings)} et ${pendingApps} candidature${plural(pendingApps)} en attente de réponse.`;
  } else if (activeListings > 0) {
    subtitle = `Vous avez ${activeListings} annonce${plural(activeListings)} active${plural(activeListings)}. Aucune candidature envoyée pour le moment.`;
  } else if (pendingApps > 0) {
    subtitle = `Vous avez ${pendingApps} candidature${plural(pendingApps)} envoyée${plural(pendingApps)}. Aucune annonce active pour le moment.`;
  } else {
    subtitle =
      "Créez votre première annonce ou candidatez à un remplacement pour démarrer.";
  }

  return {
    name: displayName,
    subtitle,
    meta: meta || undefined,
  };
}

/**
 * Actions proposées dès l'arrivée — une par rôle : publier une annonce
 * (cabinet) ou chercher un remplacement (remplaçant), puis le suivi.
 */
function adaptActions(): DashboardAction[] {
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

function adaptStats(
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

function adaptActivity(
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

function adaptReactivity(
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

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetches and adapts all dashboard data. Throws on critical failure.
 * Soft 404s (see error policy above) are not errors — missing profile is
 * signaled via `needsProfile`.
 */
export async function fetchDashboardData(
  userName?: string,
): Promise<DashboardData> {
  const [profile, listings, applications] = await Promise.all([
    fetchProfile(),
    fetchMyListings(),
    fetchMyApplications(),
  ]);

  return {
    greeting: adaptGreeting(profile, userName, listings, applications),
    actions: adaptActions(),
    stats: adaptStats(listings, applications),
    activity: adaptActivity(applications, listings),
    needsProfile: profile === null,
    reactivity: adaptReactivity(applications),
  };
}
