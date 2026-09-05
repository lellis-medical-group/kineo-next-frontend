"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/molecules/loading-state";
import { ErrorState } from "@/components/organisms/error-state";
import { ProfileView } from "@/components/templates/profile-view";
import { useSession } from "@/lib/auth-client";
import { fetchMyProfile } from "@/lib/profile-service";
import type { ApiProfile } from "@/lib/types/api";

type Status = "loading" | "error" | "success";
type Feedback = "created" | "saved" | null;

/** Orchestrator for /profile (view mode). Edit/create happen on /profile/edit. */
export function ProfileContainer() {
  const router = useRouter();
  const { data: session } = useSession();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const load = useCallback(() => {
    setStatus("loading");
    setError("");

    fetchMyProfile()
      .then((loaded) => {
        if (!loaded) {
          router.replace("/profile/create");
          return;
        }
        setProfile(loaded);
        setStatus("success");
      })
      .catch((err) => {
        // 404 = no profile → redirect to creation form.
        if (err instanceof Error && /404/i.test(err.message)) {
          router.replace("/profile/create");
          return;
        }
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setStatus("error");
      });
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") {
    return <LoadingState className="min-h-[60vh]" />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!profile) {
    return null;
  }

  return (
    <ProfileView
      profile={profile}
      userName={session?.user?.name || "Professionnel"}
      feedback={feedback}
      onEdit={() => {
        setFeedback(null);
        router.push("/profile/edit");
      }}
    />
  );
}
