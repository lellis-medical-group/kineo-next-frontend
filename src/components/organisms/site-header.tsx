import Link from "next/link";
import { BellIcon, MenuIcon } from "@/components/atoms/icons";
import { KineoLogo } from "@/components/atoms/kineo-logo";
import { UserIdentity } from "@/components/molecules/user-identity";
import type { UserSummary } from "@/lib/dashboard";
import type { HeaderLink } from "@/lib/marketing";

function ConsoleLiveBadge() {
  return (
    <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-foreground/85 lg:inline-flex">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
      Console Live
    </span>
  );
}

function NotificationsButton() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground"
    >
      <BellIcon />
    </button>
  );
}

function HeaderNav({
  links,
  activeHref,
  orientation,
}: {
  links: HeaderLink[];
  activeHref?: string;
  orientation: "horizontal" | "vertical";
}) {
  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      aria-label="Navigation principale"
      className={
        isHorizontal
          ? "hidden items-center gap-1.5 lg:flex"
          : "flex flex-col gap-1"
      }
    >
      {links.map((link) => {
        const isActive = activeHref === link.href;
        return (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader({
  links,
  activeHref,
  user,
  showConsoleBadge = false,
}: {
  links: HeaderLink[];
  activeHref?: string;
  /** Présent uniquement sur l'espace connecté. */
  user?: UserSummary;
  showConsoleBadge?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" aria-label="Kineo — Accueil">
            <KineoLogo />
          </Link>

          <HeaderNav
            links={links}
            activeHref={activeHref}
            orientation="horizontal"
          />
        </div>

        <div className="flex items-center gap-2.5">
          {user && showConsoleBadge && <ConsoleLiveBadge />}

          {user ? (
            <>
              <NotificationsButton />
              <UserIdentity
                name={user.name}
                subtitle={user.subtitle}
                textClassName="hidden xl:block"
              />
            </>
          ) : (
            <>
              <span className="hidden items-center gap-2 border-r border-border pr-4 sm:flex">
                <Link
                  href="/signin"
                  className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  Se connecter
                </Link>
              </span>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Créer un compte
              </Link>
            </>
          )}

          {/* Menu mobile sans JS : <details> natif, accessible */}
          <details className="relative lg:hidden">
            <summary
              aria-label="Ouvrir le menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border text-foreground/80 [&::-webkit-details-marker]:hidden"
            >
              <MenuIcon />
            </summary>
            <div className="absolute top-12 right-0 z-50 w-56 rounded-xl border border-border bg-surface p-2 shadow-2xl shadow-black/50">
              <HeaderNav
                links={links}
                activeHref={activeHref}
                orientation="vertical"
              />
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
