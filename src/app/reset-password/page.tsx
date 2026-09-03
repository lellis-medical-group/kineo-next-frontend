"use client";

import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useFormStatus } from "react-dom";
import { AuthCard } from "@/components/auth-card";
import { PasswordInput } from "@/components/password-input";
import { resetPassword } from "@/lib/auth-client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-60"
    >
      {pending && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
        />
      )}
      {pending ? "Enregistrement..." : "Enregistrer le mot de passe"}
    </button>
  );
}

function FullscreenSpinner() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background">
      <output
        aria-label="Chargement"
        className="block h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
      />
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
        const message = (error.message ?? "").toUpperCase();
        if (message.includes("INVALID_TOKEN")) {
          setError(
            "Ce lien a expiré ou a déjà été utilisé. Demandez un nouveau lien.",
          );
        } else if (
          message.includes("TOO_SHORT") ||
          message.includes("TOO_LONG")
        ) {
          setError("Le mot de passe doit contenir entre 8 et 128 caractères.");
        } else {
          setError(
            "Modification impossible. Vérifiez votre connexion, puis réessayez.",
          );
        }
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

          <a
            href="/forgot-password"
            className="flex w-full items-center justify-center rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Demander un nouveau lien
          </a>
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
          <output className="block rounded-lg border border-primary/30 bg-primary/10 px-4 py-3.5 text-sm leading-relaxed">
            Vous pouvez dès maintenant vous connecter avec votre nouveau mot de
            passe.
          </output>

          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="flex w-full items-center justify-center rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Se connecter
          </button>
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
          <p
            role="alert"
            className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <SubmitButton />

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
