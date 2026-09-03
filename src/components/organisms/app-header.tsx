"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/organisms/site-header";
import { useSession } from "@/lib/auth-client";
import type { UserSummary } from "@/lib/dashboard";
import { memberNav, publicNav } from "@/lib/marketing";

/**
 * En-tête applicatif : encapsule la connaissance de la session et de la
 * route courante (SRP), puis délègue le rendu au SiteHeader présentationnel (DIP).
 */
export function AppHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  if (user) {
    const identity: UserSummary = {
      name: user.name || "Professionnel",
      subtitle: "Professionnel de santé",
    };

    return (
      <SiteHeader
        links={memberNav}
        activeHref={memberNav.find((link) => link.href === pathname)?.href}
        user={identity}
        showConsoleBadge
      />
    );
  }

  return <SiteHeader links={publicNav} />;
}
