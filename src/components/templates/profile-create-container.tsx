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
import { EMPTY_PROFILE_FORM } from "@/lib/profile";
import {
  createProfile,
  fetchMyProfile,
  mapProfileError,
} from "@/lib/profile-service";

type Status = "loading" | "error" | "ready";

/** Orchestrator for /profile/create: create form, redirects to /profile/edit if profile exists. */
export function ProfileCreateContainer() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setStatus("loading");
    setError("");
    fetchMyProfile()
      .then((loaded) => {
        if (loaded) {
          router.replace("/profile/edit");
          return;
        }
        setStatus("ready");
      })
      .catch(() => {
        setStatus("ready");
      });
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(
    payload: ProfileFormData,
  ): Promise<string | undefined> {
    setError("");
    try {
      await createProfile(payload);
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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Button
        variant="ghost"
        onClick={() => router.replace("/")}
        className="mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Retour à l&apos;accueil
      </Button>

      <Card className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Créez votre profil professionnel
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Renseignez votre spécialité et votre type de pratique pour publier des
          annonces et candidater.
        </p>

        <div className="mt-6">
          <ProfileForm
            initialValues={EMPTY_PROFILE_FORM}
            submitLabel="Créer mon profil"
            pendingLabel="Création du profil…"
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
}
