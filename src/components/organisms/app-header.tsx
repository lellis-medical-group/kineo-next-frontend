"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/organisms/site-header";
import { signOut, useSession } from "@/lib/auth-client";
import type { UserSummary } from "@/lib/dashboard";
import { memberNav, publicNav } from "@/lib/marketing";

/**
 * App header: owns session and current-route knowledge (SRP), then
 * delegates rendering to the presentational SiteHeader (DIP).
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
        onSignOut={() => {
          void signOut();
        }}
      />
    );
  }

  return <SiteHeader links={publicNav} />;
}
