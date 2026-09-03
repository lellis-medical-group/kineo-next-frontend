"use client";

import { MemberHome } from "@/components/templates/member-home";
import { PublicHome } from "@/components/templates/public-home";
import { useSession } from "@/lib/auth-client";
import { defaultDashboardData } from "@/lib/dashboard";

export default function HomePage() {
  const { data: session } = useSession();

  const user = session?.user;
  if (user) {
    return <MemberHome data={defaultDashboardData} />;
  }

  return <PublicHome />;
}
