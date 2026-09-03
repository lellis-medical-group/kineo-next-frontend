import type { Metadata } from "next";
import Link from "next/link";
import { KineoLogo } from "@/components/atoms/kineo-logo";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Kineo",
  description: "Conditions d'utilisation de la console de remplacement Kineo.",
};

const sections = [
  {
    title: "1. Objet",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ],
  },
  {
    title: "2. Accès au service",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  },
  {
    title: "3. Compte utilisateur",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    ],
  },
  {
    title: "4. Données personnelles",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
    ],
  },
  {
    title: "5. Propriété intellectuelle",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    ],
  },
  {
    title: "6. Responsabilité",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
    ],
  },
  {
    title: "7. Modification des conditions",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    ],
  },
  {
    title: "8. Contact",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    ],
  },
];

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

        {/* Placeholder text (lorem ipsum) — replace with the final
            legally-reviewed version before going to production. */}
        <div className="space-y-9">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-sm leading-relaxed text-foreground/75 sm:text-[0.925rem]"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
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
