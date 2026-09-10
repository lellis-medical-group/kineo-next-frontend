"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Spinner } from "@/components/atoms/spinner";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { LoadingState } from "@/components/molecules/loading-state";
import { AuthCard } from "@/components/organisms/auth-card";
import { deleteUser } from "@/lib/auth-client";

type DeletionStatus = "deleting" | "success" | "error" | "invalid";

type DeletionOutcome = { status: "success" | "error"; error?: string };

/**
 * One in-flight or completed deletion job per token, shared across component
 * remounts (React StrictMode double-mounts effects in dev). The confirmation
 * POST consumes a single-use server-side token, so it must be sent exactly
 * once: a double request would delete the account on the first call and fail
 * with an invalid-token error on the second.
 */
const deletionJobs = new Map<string, Promise<DeletionOutcome>>();

function requestDeletion(token: string): Promise<DeletionOutcome> {
  const existing = deletionJobs.get(token);
  if (existing) {
    return existing;
  }

  const job = (async (): Promise<DeletionOutcome> => {
    const { error } = await deleteUser({ token }).catch(
      (): { error: { status: number; message?: string } } => ({
        error: { status: 0 },
      }),
    );

    if (!error) {
      // The API already deleted the account, revoked the session and
      // cleared the session cookie on this response.
      return { status: "success" };
    }

    return {
      status: "error",
      error:
        error.status === 401
          ? "Votre session a expiré. Reconnectez-vous, puis relancez la demande de suppression depuis votre profil."
          : "Ce lien de confirmation est invalide ou a expiré (valable 24 heures). Votre compte n'a pas été supprimé ; vous pouvez relancer la demande depuis votre profil.",
    };
  })();

  deletionJobs.set(token, job);
  return job;
}

function GoodbyeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<DeletionStatus>(
    token ? "deleting" : "invalid",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    requestDeletion(token).then((outcome) => {
      if (cancelled) {
        return;
      }
      setStatus(outcome.status);
      setError(outcome.error ?? "");
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "invalid" || status === "error") {
    return (
      <AuthCard
        title={status === "error" ? "Suppression impossible" : "Lien invalide"}
        subtitle={
          status === "error"
            ? "Nous n'avons pas pu supprimer votre compte"
            : "Ce lien de suppression est incomplet"
        }
      >
        <div className="space-y-6 text-center">
          <p className="text-sm leading-relaxed text-muted">{error}</p>

          <Button href="/profile" size="lg" className="w-full">
            Retour à mon profil
          </Button>
        </div>
      </AuthCard>
    );
  }

  if (status === "success") {
    return (
      <AuthCard
        title="Votre compte a été supprimé"
        subtitle="Toutes vos données ont été définitivement effacées"
      >
        <div className="space-y-6">
          <InlineAlert tone="info">
            Votre profil, vos annonces et votre historique ont été supprimés de
            la plateforme. Merci d'avoir utilisé Kineo.
          </InlineAlert>

          <Button href="/" size="lg" className="w-full">
            Retour à l'accueil
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Suppression en cours"
      subtitle="Nous supprimons définitivement votre compte"
    >
      <div className="flex justify-center">
        <output aria-label="Suppression en cours">
          <Spinner className="h-8 w-8 border-danger/20 border-t-danger" />
        </output>
      </div>
    </AuthCard>
  );
}

export default function GoodbyePage() {
  return (
    <Suspense fallback={<LoadingState className="min-h-dvh bg-background" />}>
      <GoodbyeContent />
    </Suspense>
  );
}
