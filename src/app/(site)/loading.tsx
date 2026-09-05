import { LoadingState } from "@/components/molecules/loading-state";

/**
 * Streaming boundary for the (site) group.
 *
 * - Streams the shell (header + footer) instantly while the dynamic home page
 *   resolves the session server-side.
 * - Makes dynamic routes in this group partially prefetchable: `<Link>`'s
 *   default "auto" prefetch only fetches down to the nearest loading.js
 *   boundary for dynamic routes.
 */
export default function SiteLoading() {
  return <LoadingState className="min-h-dvh" label="Chargement de la page" />;
}
