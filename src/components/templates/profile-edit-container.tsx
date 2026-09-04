"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { LoadingState } from "@/components/molecules/loading-state";
import { ErrorState } from "@/components/organisms/error-state";
import { ProfileForm } from "@/components/organisms/profile-form";
import type { ProfileFormData } from "@/lib/profile";
import { profileToFormValues } from "@/lib/profile";
import {
  fetchMyProfile,
  mapProfileError,
  updateProfile,
} from "@/lib/profile-service";
import type { ApiProfile } from "@/lib/types/api";

type Status = "loading" | "error" | "ready";

/** Orchestrator for /profile/edit: edit form, redirects to /profile/create if no profile. */
export function ProfileEditContainer() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ApiProfile | null>(null);

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
        setStatus("ready");
      })
      .catch((err) => {
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

  async function handleSubmit(
    payload: ProfileFormData,
  ): Promise<string | undefined> {
    if (!profile) {
      router.replace("/profile/create");
      return undefined;
    }
    setError("");
    try {
      await updateProfile(profile.id, payload);
      router.replace("/profile");
      return undefined;
    } catch (err) {
      return mapProfileError(err);
    }
  }

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!profile) {
    router.replace("/profile/create");
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Button
        variant="ghost"
        onClick={() => router.replace("/profile")}
        className="mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Retour au profil
      </Button>

      <Card className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Modifier le profil professionnel
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Mettez à jour vos informations professionnelles. Les changements
          seront visibles après enregistrement.
        </p>

        <div className="mt-6">
          <ProfileForm
            initialValues={profileToFormValues(profile)}
            submitLabel="Enregistrer les modifications"
            pendingLabel="Enregistrement…"
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
}
