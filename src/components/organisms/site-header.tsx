import Link from "next/link";
import { BellIcon, LogOutIcon, MenuIcon } from "@/components/atoms/icons";
import { KineoLogo } from "@/components/atoms/kineo-logo";
import { UserIdentity } from "@/components/molecules/user-identity";
import type { UserSummary } from "@/lib/dashboard";
import type { HeaderLink } from "@/lib/marketing";

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
  onSignOut,
}: {
  links: HeaderLink[];
  activeHref?: string;
  /** Only present in the authenticated area. */
  user?: UserSummary;
  /** Sign-out callback (injected by AppHeader, DIP). */
  onSignOut?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-10">
          <Link href="/" aria-label="Kineo — Accueil">
            <KineoLogo />
          </Link>

          <HeaderNav
            links={links}
            activeHref={activeHref}
            orientation="horizontal"
          />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationsButton />
              <UserIdentity
                name={user.name}
                subtitle={user.subtitle}
                showText={false}
                href="/profile"
              />

              <button
                type="button"
                onClick={onSignOut}
                aria-label="Se déconnecter"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-3 text-sm font-medium text-muted transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <LogOutIcon />
                <span className="hidden sm:inline">Se déconnecter</span>
              </button>
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

          {/* JS-free mobile menu: native <details>, accessible */}
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

              {user && onSignOut && (
                <>
                  <div className="my-2 border-t border-border" />
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                  >
                    <LogOutIcon />
                    Se déconnecter
                  </button>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
