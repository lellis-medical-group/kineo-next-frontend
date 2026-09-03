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

    const activeSegments = pathname.split("/").filter(Boolean);
    const activeLink = memberNav.find((link) => {
      if (link.href === "/") return activeSegments.length === 0;
      const linkSegments = link.href.split("/").filter(Boolean);
      return (
        activeSegments.length >= linkSegments.length &&
        linkSegments.every((seg, i) => activeSegments[i] === seg)
      );
    });

    return (
      <SiteHeader
        links={memberNav}
        activeHref={activeLink?.href}
        user={identity}
        showConsoleBadge
      />
    );
  }

  return <SiteHeader links={publicNav} />;
}
