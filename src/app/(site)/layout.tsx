import type { ReactNode } from "react";
import { AppHeader } from "@/components/organisms/app-header";
import { SiteFooter } from "@/components/organisms/site-footer";

/**
 * Shell for public and member pages: navbar + footer defined once here.
 * Auth pages (outside this route group) render without chrome.
 *
 * Server Component — interactivity lives in the client organisms it renders
 * (AppHeader resolves the session and active route client-side).
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
