"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { Spinner } from "@/components/atoms/spinner";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { ErrorState } from "@/components/organisms/error-state";
import { ProfileForm } from "@/components/organisms/profile-form";
import type { ProfileFormData } from "@/lib/profile";
import { EMPTY_PROFILE_FORM, profileToFormValues } from "@/lib/profile";
import {
  createProfile,
  fetchMyProfile,
  mapProfileError,
  updateProfile,
} from "@/lib/profile-service";
import type { ApiProfile } from "@/lib/types/api";

type Status = "loading" | "error" | "ready";

/**
 * Orchestrator for /profile/edit: loads the current profile, presents the
 * create or edit form, and redirects back to /profile on cancel/success.
 */
export function ProfileFormContainer() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ApiProfile | null>(null);

  const load = useCallback(() => {
    setStatus("loading");
    setError("");
    fetchMyProfile()
      .then((loaded) => {
        setProfile(loaded);
        setStatus("ready");
      })
      .catch(() => {
        // 404 = no profile yet → stay in create mode.
        setProfile(null);
        setStatus("ready");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(
    payload: ProfileFormData,
  ): Promise<string | undefined> {
    setError("");
    try {
      if (profile) {
        await updateProfile(profile.id, payload);
      } else {
        await createProfile(payload);
      }
      // Back to view on success — fresh fetch will run.
      router.replace("/profile");
      return undefined;
    } catch (err) {
      return mapProfileError(err);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <output aria-label="Chargement">
          <Spinner className="h-8 w-8 border-primary/20 border-t-primary" />
        </output>
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  const mode = !profile ? "create" : "edit";
  const initialValues = profile
    ? profileToFormValues(profile)
    : EMPTY_PROFILE_FORM;

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

      {mode === "edit" && (
        <InlineAlert tone="info" className="mb-4">
          Modification du profil professionnel. Les changements seront visibles
          après enregistrement.
        </InlineAlert>
      )}

      <ProfileForm
        initialValues={initialValues}
        submitLabel={
          mode === "create"
            ? "Créer mon profil"
            : "Enregistrer les modifications"
        }
        pendingLabel={
          mode === "create" ? "Création du profil…" : "Enregistrement…"
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
}
