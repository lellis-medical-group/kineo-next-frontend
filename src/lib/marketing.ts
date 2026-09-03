/**
 * Editorial content of the public page (marketing landing).
 * Kept separate from components (SRP): organisms stay presentational and
 * receive their data via props (DIP).
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
  // Routes in English (project convention); labels stay in French.
  { label: "Annonces", href: "/listings" },
  { label: "Cabinets", href: "/practices" },
  { label: "Candidatures", href: "/applications" },
  { label: "Profil", href: "/profile" },
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

export const consoleContract = {
  reference: "#8012",
  status: "Actif",
  practice: "Cabinet Médical des Pins",
  doctor: "Dr. J. Martin",
  period: "15 Fév. - 22 Fév. (Gironde)",
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

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export const testimonialsSection = {
  title: "Plus de 2000 médecins nous font confiance",
  rating: "4.9/5",
  ratingLabel: "avis professionnels",
  items: [
    {
      quote:
        "Grâce à Kineo, j'ai trouvé un remplaçant sérieux pour mes deux semaines de congés en moins de 48h.",
      author: "Dr. Michel V.",
      role: "Généraliste - Lyon",
    },
    {
      quote:
        "L'automatisation du contrat et de la signature électronique m'évite de longues heures de paperasse.",
      author: "Dr. Clara D.",
      role: "Médecin remplaçante - Bordeaux",
    },
    {
      quote:
        "Une interface claire et des profils vérifiés. C'est exactement ce qu'il manquait pour nos cabinets ruraux.",
      author: "Dr. Étienne L.",
      role: "Pédiatre - Dax",
    },
  ] as TestimonialItem[],
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
    { label: "Console Live", href: "#" },
  ],
  legalLinks: [
    { label: "À propos", href: "#" },
    { label: "Contact", href: "#" },
    { label: "CGU", href: "/terms" },
    { label: "Confidentialité", href: "#" },
  ],
  copyright: "© 2025 Kineo. Tous droits réservés.",
  tagline: "Conçu pour les professionnels de santé français.",
};
