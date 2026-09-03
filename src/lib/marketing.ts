/**
 * Editorial content of the public pages.
 * Kept separate from components so organisms stay presentational.
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

export const hero = {
  title: "Le remplacement médical, simplifié.",
  subtitle:
    "Kineo connecte médecins installés et remplaçants avec un suivi transparent et une gestion administrative automatisée.",
  primaryCta: { label: "Trouver un remplaçant", href: "/signup" },
  secondaryCta: { label: "Chercher un remplacement", href: "/signup" },
};

export const trustBar = {
  eyebrow: "Plateforme régulée & sécurisée",
  items: [
    { icon: "shield", label: "Vérification RPPS" },
    { icon: "calendar", label: "Suivi en temps réel" },
    { icon: "percent", label: "Gratuit en bêta" },
  ] as const,
};

export interface FeatureItem {
  icon: "pencil" | "users" | "mapPin";
  title: string;
  description: string;
}

export const featuresSection = {
  title: "Tout pour gérer vos remplacements",
  features: [
    {
      icon: "pencil",
      title: "Publiez en 2 minutes",
      description:
        "Remplissez un court questionnaire avec vos besoins, les dates et la rétrocession proposée.",
    },
    {
      icon: "users",
      title: "Candidatures transparentes",
      description:
        "Consultez les profils qualifiés, vérifiés par l'Ordre des Médecins, et échangez en direct.",
    },
    {
      icon: "mapPin",
      title: "Recherche géolocalisée",
      description:
        "Trouvez des opportunités ou des remplaçants ciblés dans votre département.",
    },
  ] as FeatureItem[],
};

export const joinCta = {
  title: "Rejoignez Kineo gratuitement",
  subtitle:
    "Inscrivez-vous dès aujourd'hui pour simplifier votre prochain remplacement médical.",
  emailPlaceholder: "votre.email@rpps.fr",
  submitLabel: "Commencer",
};

export const footerContent = {
  description:
    "La plateforme moderne dédiée à la mise en relation et à la simplification administrative du remplacement médical en France.",
  productLinks: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Comment ça marche", href: "#" },
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
