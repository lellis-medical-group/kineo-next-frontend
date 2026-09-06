"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { TrashIcon } from "@/components/atoms/icons";
import { Spinner } from "@/components/atoms/spinner";
import { InlineAlert } from "@/components/molecules/inline-alert";

export interface DeleteAccountSectionProps {
  /** Triggers account deletion + post-action sign-out/redirect. */
  onDeleteAccount: () => Promise<void>;
}

/**
 * Destructive "Supprimer mon compte" panel.
 * Requires an explicit confirmation checkbox before the delete button is
 * enabled; surfaces errors inline. Placed at the bottom of the profile view.
 */
export function DeleteAccountSection({
  onDeleteAccount,
}: DeleteAccountSectionProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirmed) return;
    setError("");
    setSubmitting(true);
    try {
      await onDeleteAccount();
      // onSuccess: the container signs out and redirects — this component
      // unmounts, so no pending state is rendered.
    } catch {
      setError(
        "Impossible de supprimer le compte pour le moment. Veuillez réessayer plus tard.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-label="Suppression du compte">
      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger"
          >
            <TrashIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-danger">
              Supprimer mon compte
            </h2>
            <p className="mt-0.5 max-w-lg text-sm text-muted">
              Cette action est irréversible : votre profil, vos annonces et
              votre historique seront définitivement supprimés de la plateforme.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-danger"
            />
            <span className="text-foreground/85">
              Je comprends que cette action est irréversible et que toutes mes
              données seront définitivement supprimées.
            </span>
          </label>
        </div>

        {error && (
          <InlineAlert as="p" tone="danger" className="mt-3">
            {error}
          </InlineAlert>
        )}

        <Button
          variant="danger"
          disabled={!confirmed || submitting}
          onClick={handleDelete}
          className="mt-4 w-full"
        >
          {submitting && (
            <Spinner className="h-4 w-4 border-danger-foreground/30 border-t-danger-foreground" />
          )}
          {submitting
            ? "Suppression du compte…"
            : "Supprimer définitivement mon compte"}
        </Button>
      </div>
    </section>
  );
}
