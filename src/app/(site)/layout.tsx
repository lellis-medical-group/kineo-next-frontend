import type { ReactNode } from "react";
import { Suspense } from "react";
import { AppHeader } from "@/components/organisms/app-header";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { publicNav } from "@/lib/navigation";

/** Shell for public and member pages: shared navbar + footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* AppHeader uses navigation hooks (useRouter/usePathname): wrapping it
          in Suspense lets Next stream it in after prerendering the static shell,
          instead of failing the build on client hooks during prerender. */}
      <Suspense fallback={<SiteHeader links={publicNav} />}>
        <AppHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
