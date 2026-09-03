"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/organisms/app-header";
import { SiteFooter } from "@/components/organisms/site-footer";

/**
 * Shell des pages publiques et membres : la navbar et le footer vivent ici,
 * une seule fois, et non plus dans chaque page/template (SRP).
 * Les pages d'authentification, hors de ce route group, n'ont pas de chrome.
 *
 * Le header est rendu de manière optimiste (nav publique) pendant la
 * résolution de la session : le contenu SSR reste complet, sans splash.
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
