"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/organisms/app-header";
import { SiteFooter } from "@/components/organisms/site-footer";

/**
 * Shell des pages publiques et membres : navbar + footer définis ici, une
 * seule fois, plutôt que répétés dans chaque page. Les pages de connexion,
 * hors de ce groupe de routes, restent sans chrome.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
