"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { Spinner } from "@/components/atoms/spinner";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { ApiError } from "@/lib/api-client";
import { type ApplicationEntry, withdrawApplication } from "@/lib/applications";

export interface ApplicationWithdrawProps {
  application: ApplicationEntry;
  /** Called after a successful withdrawal — updated entry when the API echoes one, null to refetch. */
  onWithdrawn: (updated: ApplicationEntry | null) => void;
  className?: string;
}

/** Backend WithdrawApplicationDto — optional reason, 1-500 chars. */
const MAX_REASON_LENGTH = 500;

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "Cette candidature ne peut plus être retirée dans son statut actuel.";
    }
    if (error.status === 401 || error.status === 403) {
      return "Votre session a expiré. Veuillez vous reconnecter.";
    }
  }
  return "Le retrait a échoué pour le moment. Veuillez réessayer.";
}

/** Withdraw panel: outline trigger, then optional reason + danger confirm. */
export function ApplicationWithdraw({
  application,
  onWithdrawn,
  className,
}: ApplicationWithdrawProps) {
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const updated = await withdrawApplication(application.id, reason);
      onWithdrawn(updated);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Retrait de la candidature" className={className}>
      <Card className="border-danger/30 bg-danger/5 p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-danger">
              Retirer ma candidature
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Votre candidature ne sera plus visible par le cabinet. Cette
              action est définitive.
            </p>
          </div>
        </div>

        {confirming ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <label
              htmlFor="withdrawn-reason"
              className="flex items-baseline justify-between gap-4"
            >
              <span className="field-label">Motif du retrait (optionnel)</span>
              <span className="text-xs text-faint">
                {reason.length}/{MAX_REASON_LENGTH}
              </span>
            </label>
            <textarea
              id="withdrawn-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              maxLength={MAX_REASON_LENGTH}
              placeholder="Ex. : j'ai finalement trouvé un remplacement sur la même période…"
              className="field-input mt-2 resize-none text-sm"
            />

            {error && (
              <InlineAlert as="p" tone="danger" className="mt-4">
                {error}
              </InlineAlert>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" variant="danger" disabled={submitting}>
                {submitting && (
                  <Spinner className="h-4 w-4 border-danger-foreground/30 border-t-danger-foreground" />
                )}
                {submitting ? "Retrait en cours…" : "Confirmer le retrait"}
              </Button>
              <Button
                variant="ghost"
                disabled={submitting}
                onClick={() => {
                  setConfirming(false);
                  setError("");
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setConfirming(true)}
          >
            Retirer ma candidature
          </Button>
        )}
      </Card>
    </section>
  );
}
