import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/atoms/card";
import { SectionHeading } from "@/components/atoms/section-heading";

export const metadata: Metadata = {
  title: "Profil — Kineo",
  description: "Gestion du profil professionnel Kineo.",
};

const comingSoonFeatures = [
  "Vos informations professionnelles (RPPS, spécialité, secteur)",
  "Vos cabinets et lieux d'exercice",
  "Vos préférences de remplacement et disponibilités",
  "Vos documents et justificatifs",
];

/** Profile page — placeholder until GET /profile/me is exposed by the backend. Shell inherited from (site) group. */
export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Card className="p-6 sm:p-8">
        <SectionHeading title="Votre profil" />

        <p className="mt-4 text-sm leading-relaxed text-muted">
          La page de gestion de votre profil professionnel arrive très
          prochainement. Vous y retrouverez :
        </p>

        <ul className="mt-4 space-y-2">
          {comingSoonFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-foreground/85"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/50 hover:text-foreground"
        >
          ← Retour à l'accueil
        </Link>
      </Card>
    </div>
  );
}
