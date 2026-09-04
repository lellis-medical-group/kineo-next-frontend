import type { Metadata } from "next";
import Link from "next/link";
import { KineoLogo } from "@/components/atoms/kineo-logo";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Kineo",
  description: "Conditions d'utilisation de la console de remplacement Kineo.",
};

/**
 * Terms of service — definitive text is being drafted.
 * Sections listed below (standard ToS structure) will be completed by the legal team before production.
 */

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
      <article className="mx-auto w-full max-w-2xl">
        <header className="mb-10 flex flex-col items-center gap-7 text-center">
          <Link href="/" aria-label="Kineo — Accueil">
            <KineoLogo />
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Conditions d&apos;utilisation
            </h1>
            <p className="text-sm text-muted">
              Dernière mise à jour : 3 septembre 2026
            </p>
          </div>
        </header>

        <p className="text-sm leading-relaxed text-foreground/75 sm:text-[0.925rem]">
          Les conditions générales d&apos;utilisation de la console Kineo sont
          en cours de rédaction par notre service juridique. Elles seront
          publiées ici avant la mise en production de la plateforme.
        </p>

        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold">
            Elles couvriront notamment :
          </h2>
          <ul className="space-y-2">
            {[
              "L'objet du service et son accès",
              "La création et la gestion du compte utilisateur",
              "Le traitement des données personnelles (RGPD)",
              "La propriété intellectuelle",
              "La responsabilité des parties",
              "Les modalités de modification des présentes conditions",
              "Le contact du support Kineo",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-foreground/85"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-14 border-t border-border pt-6 text-center">
          <Link
            href="/signup"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            ← Retour à l&apos;inscription
          </Link>
        </footer>
      </article>
    </main>
  );
}
