import type { ReactNode } from "react";
import { AppHeader } from "@/components/organisms/app-header";
import { SiteFooter } from "@/components/organisms/site-footer";

/** Shell for public and member pages: shared navbar + footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
