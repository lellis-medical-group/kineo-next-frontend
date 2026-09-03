import Link from "next/link";
import { KineoLogo } from "@/components/atoms/kineo-logo";
import { footerContent } from "@/lib/marketing";

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label={title}>
      <h3 className="mb-4 text-xs font-bold tracking-widest text-foreground/60 uppercase">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              title={link.href === "#" ? "Bientôt disponible" : undefined}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-16">
          <div className="max-w-sm">
            <KineoLogo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {footerContent.description}
            </p>
          </div>

          <FooterLinkColumn
            title="Produit"
            links={footerContent.productLinks}
          />
          <FooterLinkColumn
            title="Légal & Contact"
            links={footerContent.legalLinks}
          />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kineo. Tous droits réservés.</p>
          <p>{footerContent.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
