"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/organisms/app-header";
import { SiteFooter } from "@/components/organisms/site-footer";

/**
 * Shell of public and member pages: the navbar and footer live here, once,
 * no longer in every page/template (SRP). Auth pages, outside this route
 * group, stay chromeless.
 *
 * The header is rendered optimistically (public nav) while the session
 * resolves: SSR content stays complete, no splash screen.
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
