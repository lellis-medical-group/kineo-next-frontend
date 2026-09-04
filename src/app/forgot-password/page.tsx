"use client";

import Form from "next/form";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { SubmitButton } from "@/components/molecules/submit-button";
import { AuthCard } from "@/components/organisms/auth-card";
import { requestPasswordReset } from "@/lib/auth-client";

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
          <InlineAlert tone="info">
            Si un compte existe avec cet e-mail, vous recevrez un lien de
            réinitialisation dans quelques instants.
            <br />
            Pensez à vérifier votre dossier spam.
          </InlineAlert>

          <Button href="/signin" size="lg" className="w-full">
            Retour à la connexion
          </Button>
        </div>
      ) : notEnabled ? (
        <div className="space-y-6">
          <InlineAlert tone="warning">
            La réinitialisation en ligne n&apos;est pas encore activée.
            Contactez l&apos;administrateur de votre structure pour
            réinitialiser votre mot de passe.
          </InlineAlert>

          <Button href="/signin" size="lg" className="w-full">
            Retour à la connexion
          </Button>
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
                placeholder="jean.dupont@exemple.fr"
                className="field-input"
              />
            </label>

            {error && (
              <InlineAlert as="p" tone="danger">
                {error}
              </InlineAlert>
            )}

            <SubmitButton
              label="Recevoir le lien"
              pendingLabel="Envoi du lien..."
            />
          </Form>

          <p className="mt-6 text-center text-sm text-muted">
            Mot de passe retrouvé ?{" "}
            <Link
              href="/signin"
              className="font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Se connecter
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
