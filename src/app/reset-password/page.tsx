"use client";

import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Spinner } from "@/components/atoms/spinner";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { PasswordInput } from "@/components/molecules/password-input";
import { SubmitButton } from "@/components/molecules/submit-button";
import { AuthCard } from "@/components/organisms/auth-card";
import { resetPassword } from "@/lib/auth-client";
import { mapResetPasswordError } from "@/lib/auth-errors";

function FullscreenSpinner() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background">
      <output aria-label="Chargement">
        <Spinner className="h-8 w-8 border-primary/20 border-t-primary" />
      </output>
    </main>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    const newPassword = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (newPassword !== confirm) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    try {
      const { error } = await resetPassword({ newPassword, token });

      if (error) {
        setError(mapResetPasswordError(error));
        return;
      }

      setDone(true);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez plus tard.");
    }
  }

  if (!token) {
    return (
      <AuthCard
        title="Lien invalide"
        subtitle="Ce lien de réinitialisation est incomplet ou expiré"
      >
        <div className="space-y-6 text-center">
          <p className="text-sm leading-relaxed text-muted">
            Demandez un nouveau lien pour choisir un nouveau mot de passe.
          </p>

          <Button href="/forgot-password" size="lg" className="w-full">
            Demander un nouveau lien
          </Button>
        </div>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard
        title="Mot de passe modifié"
        subtitle="Votre nouveau mot de passe est actif"
      >
        <div className="space-y-6">
          <InlineAlert tone="info">
            Vous pouvez dès maintenant vous connecter avec votre nouveau mot de
            passe.
          </InlineAlert>

          <Button
            onClick={() => router.push("/signin")}
            size="lg"
            className="w-full"
          >
            Se connecter
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe pour votre compte Kineo"
    >
      <Form action={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2" htmlFor="password">
          <span className="field-label">Nouveau mot de passe</span>
          <PasswordInput
            name="password"
            id="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••••••"
          />
        </label>

        <label className="flex flex-col gap-2" htmlFor="confirm">
          <span className="field-label">Confirmer le mot de passe</span>
          <PasswordInput
            name="confirm"
            id="confirm"
            required
            autoComplete="new-password"
            placeholder="••••••••••••"
          />
        </label>

        {error && (
          <InlineAlert as="p" tone="danger">
            {error}
          </InlineAlert>
        )}

        <SubmitButton
          label="Enregistrer le mot de passe"
          pendingLabel="Enregistrement..."
        />

        <p className="text-center text-xs text-muted">
          8 caractères minimum. Astuce : une phrase longue est plus facile à
          retenir qu&apos;un mot compliqué.
        </p>
      </Form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullscreenSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
