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

const WARM_GREETINGS = [
  "Ravi de vous revoir !",
  "Heureux de vous retrouver parmi nous !",
  "Bienvenue sur votre espace !",
  "Bonne journée, et merci d'être là !",
  "Content de vous voir !",
  "Votre tableau de bord vous attend !",
  "Prêt pour une belle journée ?",
  "Toujours un plaisir de vous accueillir !",
  "Bienvenue, on est heureux de vous compter parmi nous !",
  "Bon retour parmi nous !",
  "Votre communauté a besoin de vous !",
  "Ensemble, facilitons les remplacements !",
  "Merci de faire vivre Kineo !",
  "Votre engagement fait la différence !",
  "Bienvenue dans votre espace dédié !",
];

function pickWarmGreeting(): string {
  return WARM_GREETINGS[Math.floor(Math.random() * WARM_GREETINGS.length)];
}

function adaptGreeting(
  profile: ApiProfile,
  userName?: string,
): DashboardData["greeting"] {
  const displayName =
    userName ||
    (profile.rppsNumber
      ? `Dr. ${profile.rppsNumber.slice(-4)}`
      : "Professionnel");

  const meta = [profile.city, formatSpecialty(profile.specialty)]
    .filter(Boolean)
    .join(" · ");

  return {
    name: displayName,
    subtitle: pickWarmGreeting(),
    meta: meta || undefined,
  };
}

function adaptActions(): DashboardAction[] {
  return [
    {
      label: "Créer une annonce",
      href: "/listings/new",
      variant: "primary",
      icon: "plus",
    },
    { label: "Mes candidatures", href: "/applications", variant: "outline" },
    { label: "Mes cabinets", href: "/practices", variant: "outline" },
  ];
}

function adaptStats(
  listings: ApiReplacementListing[],
  applications: ApiApplication[],
): DashboardStat[] {
  const open = listings.filter((l) => l.status === "OPEN").length;
  const discussion = listings.filter((l) => l.status === "DISCUSSION").length;
  const pendingApps = applications.filter((a) => a.status === "PENDING").length;
  const newApps = applications.filter(
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
        label: "période à pourvoir",
        detail: upcoming.title,
        icon: "calendar",
      }
    : {
        id: "next-replacement",
        title: "Prochain remplacement",
        value: "Aucun",
        label: "aucun remplacement à prévoir",
        detail: "Créez une annonce pour trouver un remplaçant",
        icon: "calendar",
      };

  return [
    {
      id: "listings",
      title: "Annonces actives",
      value: `${activeListings}`,
      label: `annonce${activeListings > 1 ? "s" : ""} en cours de recrutement`,
      detail:
        open > 0 || discussion > 0
          ? `${open} ouverte${open > 1 ? "s" : ""} · ${discussion} en discussion`
          : undefined,
      icon: "layers",
    },
    {
      id: "applications",
      title: "Candidatures",
      value: `${pendingApps}`,
      label: `candidature${pendingApps > 1 ? "s" : ""} en attente de réponse`,
      detail:
        newApps > 0
          ? `${newApps} nouvelle${newApps > 1 ? "s" : ""} reçue${newApps > 1 ? "s" : ""}`
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
            { text: "Candidature acceptée pour " },
            { text: listingLabel, bold: true },
          ];
          break;
        case "REJECTED":
          message = [
            { text: "Candidature refusée pour " },
            { text: listingLabel, bold: true },
          ];
          break;
        default:
          message = [
            { text: "Nouvelle candidature pour " },
            { text: listingLabel, bold: true },
          ];
      }

      return {
        id: `act-${i + 1}`,
        icon:
          app.status === "ACCEPTED" ? ("check" as const) : ("users" as const),
        message,
        timestamp: formatRelativeTime(app.createdAt),
        href: "/applications",
      };
    });
}

function adaptReactivity(
  applications: ApiApplication[],
): DashboardData["reactivity"] {
  const responded = applications.filter((a) => a.respondedAt).length;
  const total = applications.length;
  const rate = total > 0 ? Math.round((responded / total) * 100) : 0;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;

  const stats: ReactivityStat[] = [
    { label: "Taux de réponse", value: `${rate}%`, accent: true },
    { label: "Candidatures reçues", value: `${total}` },
    { label: "Acceptées", value: `${accepted}` },
  ];

  return {
    title: "Vos indicateurs",
    stats,
    tipTitle: "Conseil Kineo",
    tip: "Les profils avec un taux de réponse supérieur à 80% reçoivent en moyenne 2,5 fois plus de candidatures. Répondez rapidement !",
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
    greeting: adaptGreeting(profile, userName),
    actions: adaptActions(),
    stats: adaptStats(listings, applications),
    activity: adaptActivity(applications, listings),
    reactivity: adaptReactivity(applications),
  };
}
