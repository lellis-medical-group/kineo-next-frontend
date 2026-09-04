/**
 * Editorial content of the public pages.
 * Kept separate from components so organisms stay presentational.
 * Structural navigation lives in `lib/navigation.ts`.
 */

export const hero = {
  title: "Le remplacement médical, simplifié.",
  subtitle:
    "Médecin installé, publiez votre annonce et choisissez le remplaçant qui vous convient. Remplaçant, trouvez les remplacements qui correspondent à vos dates et candidatez en un clic.",
  primaryCta: { label: "Publier une annonce", href: "/signup" },
  secondaryCta: { label: "Trouver un remplacement", href: "/signup" },
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
  title: "Deux rôles, une seule plateforme",
  subtitle:
    "Vous pouvez être médecin installé, remplaçant, ou les deux — Kineo s'adapte à votre situation.",
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

export const joinCta = {
  title: "Rejoignez Kineo gratuitement",
  subtitle:
    "Créez votre compte : publiez vos annonces ou candidatez aux remplacements. Gratuit pendant la bêta, sans engagement.",
  emailPlaceholder: "prenom.nom@exemple.fr",
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
