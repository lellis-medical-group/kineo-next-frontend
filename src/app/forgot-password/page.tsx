"use client";

import Form from "next/form";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { AuthCard } from "@/components/organisms/auth-card";
import { requestPasswordReset } from "@/lib/auth-client";

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
      {pending ? "Envoi du lien..." : "Recevoir le lien"}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [notEnabled, setNotEnabled] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    setNotEnabled(false);
    const email = formData.get("email") as string;

    try {
      const { error } = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        const message = (error.message ?? "").toLowerCase();
        const code = error.code ?? "";
        if (
          code === "RESET_PASSWORD_DISABLED" ||
          message.includes("isn't enabled") ||
          message.includes("not enabled")
        ) {
          setNotEnabled(true);
        } else {
          setError(
            "L'envoi a échoué. Vérifiez votre connexion, puis réessayez.",
          );
        }
        return;
      }

      setSent(true);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez plus tard.");
    }
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Nous vous enverrons un lien pour choisir un nouveau mot de passe"
    >
      {sent ? (
        <div className="space-y-6">
          <output className="block rounded-lg border border-primary/30 bg-primary/10 px-4 py-3.5 text-sm leading-relaxed">
            Si un compte existe avec cet e-mail, vous recevrez un lien de
            réinitialisation dans quelques instants.
            <br />
            Pensez à vérifier votre dossier spam.
          </output>

          <a
            href="/signin"
            className="flex w-full items-center justify-center rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Retour à la connexion
          </a>
        </div>
      ) : notEnabled ? (
        <div className="space-y-6">
          <output className="block rounded-lg border border-warning/30 bg-warning/10 px-4 py-3.5 text-sm leading-relaxed">
            La réinitialisation en ligne n&apos;est pas encore activée.
            Contactez l&apos;administrateur de votre structure pour
            réinitialiser votre mot de passe.
          </output>

          <a
            href="/signin"
            className="flex w-full items-center justify-center rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Retour à la connexion
          </a>
        </div>
      ) : (
        <>
          <Form action={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2" htmlFor="email">
              <span className="field-label">Adresse e-mail</span>
              <input
                name="email"
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="dr.julien.martin@gmail.com"
                className="field-input"
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
          </Form>

          <p className="mt-6 text-center text-sm text-muted">
            Mot de passe retrouvé ?{" "}
            <a
              href="/signin"
              className="font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Se connecter
            </a>
          </p>
        </>
      )}
    </AuthCard>
  );
}
