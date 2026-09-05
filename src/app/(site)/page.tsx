import { DashboardContainer } from "@/components/templates/dashboard-container";
import { PublicHome } from "@/components/templates/public-home";
import { fetchServerSession } from "@/lib/server-session";

/** Server-side branch: dashboard for members, marketing for anonymous. */
export default async function HomePage() {
  const session = await fetchServerSession();

  if (session) {
    return <DashboardContainer userName={session.name} />;
  }

  return <PublicHome />;
}
