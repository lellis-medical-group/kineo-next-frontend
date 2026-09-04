/**
 * Dashboard data service — fetches from backend and adapts to presentation types.
 *
 * Single Responsibility: orchestrate API calls and transform raw data into the
 * DashboardData shape consumed by presentation components (DIP).
 */

import type {
  ActivityEntry,
  DashboardAction,
  DashboardData,
  DashboardStat,
  ReactivityStat,
} from "./dashboard";
import type {
  ApiApplication,
  ApiPaginated,
  ApiProfile,
  ApiReplacementListing,
} from "./types/api";

/**
 * Backend base URL — must be set via NEXT_PUBLIC_BACKEND_URL env var.
 * Falls back to same-origin /api if unset (dev default).
 */
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

/**
 * Fetch with credentials and error handling.
 * Throws on non-OK responses so callers can distinguish network vs domain errors.
 */
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Normalizes API responses — handles both paginated ({ data: [], meta: {} })
 * and direct array responses. Returns a flat array.
 */
function extractData<T>(raw: T[] | { data: T[] }): T[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "data" in raw)
    return (raw as { data: T[] }).data;
  return [];
}

// ── Raw data fetching ────────────────────────────────────────────────────────

async function fetchProfile(): Promise<ApiProfile> {
  return apiFetch<ApiProfile>("/profile/me");
}

async function fetchMyListings(): Promise<ApiReplacementListing[]> {
  const raw = await apiFetch<
    ApiPaginated<ApiReplacementListing> | ApiReplacementListing[]
  >("/replacement-listings/mine");
  return extractData(raw);
}

async function fetchMyApplications(): Promise<ApiApplication[]> {
  const raw = await apiFetch<ApiPaginated<ApiApplication> | ApiApplication[]>(
    "/applications/mine",
  );
  return extractData(raw);
}

// ── Adapters (raw API → presentation types) ──────────────────────────────────

/**
 * Pluralise un suffixe français selon le nombre.
 */
function plural(count: number, suffix = "s"): string {
  return count > 1 ? suffix : "";
}

/**
 * Sous-titre informatif et déterministe : résume ce que la page affiche et
 * d'où viennent les chiffres (annonces publiées par l'utilisateur,
 * candidatures qu'il a envoyées). Remplace les messages d'accueil aléatoires.
 */
function adaptGreeting(
  profile: ApiProfile,
  userName: string | undefined,
  listings: ApiReplacementListing[],
  applications: ApiApplication[],
): DashboardData["greeting"] {
  const displayName =
    userName ||
    (profile.rppsNumber
      ? `Dr. ${profile.rppsNumber.slice(-4)}`
      : "Professionnel");

  const meta = [profile.city, formatSpecialty(profile.specialty)]
    .filter(Boolean)
    .join(" · ");

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
  // Candidatures ENVOYÉES par l'utilisateur (source : /applications/mine).
  const pendingApps = applications.filter((a) => a.status === "PENDING").length;
  // viewedAt est posé quand le cabinet consulte la candidature.
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

  // Le fil reflète UNIQUEMENT les candidatures envoyées par l'utilisateur
  // (source : /applications/mine) — messages rédigés de son point de vue.
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
  // Toutes les métriques portent sur les candidatures ENVOYÉES par
  // l'utilisateur — le libellé « reçues » était factuellement faux.
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

  if (sameMonth) {
    const startDay = s.toLocaleDateString("fr-FR", { day: "numeric" });
    const endDate = e.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    return `Du ${startDay} au ${endDate}`;
  }

  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `Du ${s.toLocaleDateString("fr-FR", opts)} au ${e.toLocaleDateString(
    "fr-FR",
    opts,
  )}`;
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "il y a moins d'une heure";
  if (diffHours < 24) return `il y a ${diffHours} heures`;
  if (diffDays === 1) return "hier";
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  return `il y a ${Math.floor(diffDays / 7)} semaines`;
}

function formatSpecialty(
  specialty: ApiProfile["specialty"],
): string | undefined {
  const labels: Record<ApiProfile["specialty"], string> = {
    GENERALIST: "médecine générale",
    DENTIST: "dentisterie",
    DERMATOLOGIST: "dermatologie",
    PSYCHIATRIST: "psychiatrie",
    OTHER: "autre spécialité",
  };
  return labels[specialty];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetches all dashboard data from the backend and adapts it.
 * Throws if any critical endpoint fails — callers should handle errors.
 *
 * @param userName - Display name from the session (optional, for personalized greeting)
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
    reactivity: adaptReactivity(applications),
  };
}
