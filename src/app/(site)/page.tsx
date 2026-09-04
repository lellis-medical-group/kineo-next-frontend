"use client";

import { DashboardContainer } from "@/components/templates/dashboard-container";
import { PublicHome } from "@/components/templates/public-home";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const { data: session } = useSession();

  const user = session?.user;
  if (user) {
    return <DashboardContainer userName={user.name} />;
  }

  return <PublicHome />;
}
