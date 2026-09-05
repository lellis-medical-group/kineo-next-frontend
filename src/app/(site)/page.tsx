import { DashboardContainer } from "@/components/templates/dashboard-container";
import { PublicHome } from "@/components/templates/public-home";
import { fetchServerSession } from "@/lib/server-session";

/**
 * Home = member console for authenticated users, public marketing otherwise.
 *
 * The choice is made SERVER-side (session validated through the auth proxy),
 * so the marketing content is a true Server Component (no client hydration of
 * the public page) and members get the right shell on first paint — no
 * post-hydration flash of the public home.
 */
export default async function HomePage() {
  const session = await fetchServerSession();

  if (session) {
    return <DashboardContainer userName={session.name} />;
  }

  return <PublicHome />;
}
