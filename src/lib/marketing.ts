/**
 * Editorial content of the public pages.
 * Kept separate from components so organisms stay presentational.
 * Structural navigation lives in `lib/navigation.ts`.
 */

export const hero = {
  eyebrow: "Bêta ouverte",
  title: "Le remplacement médical,",
  titleAccent: "simplifié.",
  subtitle:
    "Médecin installé, publiez votre annonce et choisissez le remplaçant qui vous convient. Remplaçant, trouvez les remplacements qui correspondent à vos dates et candidatez en un clic.",
  primaryCta: { label: "Publier une annonce", href: "/signup" },
  secondaryCta: { label: "Trouver un remplacement", href: "/signup" },
};

export const trustBar = {
  eyebrow: "Une plateforme régulée, pensée pour la médecine française",
  items: [
    {
      icon: "shield",
      label: "Identités vérifiées",
      detail: "Chaque profil RPPS est contrôlé avant activation.",
    },
    {
      icon: "calendar",
      label: "Suivi en temps réel",
      detail: "Envoyée, vue, acceptée : chaque statut est visible.",
    },
    {
      icon: "percent",
      label: "Gratuit pendant la bêta",
      detail: "Aucun frais, aucun engagement, dès aujourd'hui.",
    },
  ] as const,
};

/**
 * ⚠️ PLACEHOLDER STATS — replace with real platform metrics (or remove the
 * section) before going public.
 */
export const proofStats = {
  items: [
    { value: 250, suffix: "+", label: "Professionnels de santé inscrits" },
    { value: 42, suffix: "", label: "Départements couverts" },
    { value: 900, suffix: "+", label: "Candidatures traitées chaque mois" },
  ] as const,
};

export interface FeatureItem {
  icon: "pencil" | "users" | "mapPin";
  title: string;
  description: string;
}

export const featuresSection = {
  title: "Deux rôles, une seule plateforme",
  subtitle:
    "Vous pouvez être médecin installé, remplaçant, ou les deux. Kineo s'adapte à votre situation.",
  features: [
    {
      icon: "pencil",
      title: "Vous cherchez un remplaçant ?",
      description:
        "Publiez votre annonce en 2 minutes : dates, rétrocession, attentes. Les remplaçants vérifiés vous adressent leurs candidatures, et vous choisissez.",
    },
    {
      icon: "users",
      title: "Vous cherchez un remplacement ?",
      description:
        "Parcourez les annonces ouvertes près de chez vous, consultez les dates et la rétrocession, puis candidatez en un clic avec un message personnalisé.",
    },
    {
      icon: "mapPin",
      title: "Un suivi transparent, des deux côtés",
      description:
        "Envoyée, vue, acceptée, refusée : chaque candidature affiche son statut en temps réel. Fini les réponses qui se perdent.",
    },
  ] as FeatureItem[],
};

export interface HowItWorksStep {
  icon: "pencil" | "users" | "check";
  title: string;
  description: string;
}

export const howItWorks = {
  title: "Comment ça marche",
  subtitle:
    "Un parcours en trois étapes, pensé pour les deux côtés de la table — du besoin au remplacement finalisé.",
  steps: [
    {
      icon: "pencil",
      title: "Publiez votre annonce",
      description:
        "Dates, rétrocession, attentes : décrivez votre besoin en deux minutes, sans formalités inutiles.",
    },
    {
      icon: "users",
      title: "Recevez des candidatures vérifiées",
      description:
        "Les remplaçants RPPS vérifiés postulent avec un message personnalisé. Vous suivez tout en temps réel.",
    },
    {
      icon: "check",
      title: "Choisissez et validez",
      description:
        "Comparez les profils, échangez, puis acceptez la candidature idéale. Le reste se passe sereinement.",
    },
  ] as HowItWorksStep[],
};

export const joinCta = {
  title: "Rejoignez Kineo gratuitement",
  subtitle:
    "Créez votre compte : publiez vos annonces ou candidatez aux remplacements. Gratuit pendant la bêta, sans engagement.",
  emailPlaceholder: "prenom.nom@exemple.fr",
  submitLabel: "Commencer",
  reassuranceNote: "Sans carte bancaire, annulable à tout moment.",
};

export const footerContent = {
  description:
    "La plateforme moderne dédiée à la mise en relation et à la simplification administrative du remplacement médical en France.",
  productLinks: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Comment ça marche", href: "#how-it-works" },
    { label: "Tarifs", href: "#" },
  ],
  legalLinks: [
    { label: "À propos", href: "#" },
    { label: "Contact", href: "#" },
    { label: "CGU", href: "/terms" },
    { label: "Confidentialité", href: "#" },
  ],
  tagline: "Conçu pour les professionnels de santé français.",
};
