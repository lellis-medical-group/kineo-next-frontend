"use client";

import { Spinner } from "@/components/atoms/spinner";
import { MemberHome } from "@/components/templates/member-home";
import { PublicHome } from "@/components/templates/public-home";
import { useSession } from "@/lib/auth-client";
import { defaultDashboardData } from "@/lib/dashboard";

function SplashScreen() {
  return (
    <main
      aria-busy="true"
      className="flex min-h-dvh items-center justify-center bg-background text-primary"
    >
      <Spinner className="h-8 w-8" />
    </main>
  );
}

export default function HomePage() {
  const { data: session, isPending, error } = useSession();

  if (isPending && !error) {
    return <SplashScreen />;
  }

  const user = session?.user;
  if (user) {
    return (
      <MemberHome
        user={{
          name: user.name || "Professionnel",
          subtitle: "Professionnel de santé",
        }}
        data={defaultDashboardData}
      />
    );
  }

  return <PublicHome />;
}
