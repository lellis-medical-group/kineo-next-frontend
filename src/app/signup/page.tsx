"use client";

import Form from "next/form";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { Spinner } from "@/components/atoms/spinner";
import { EmailField } from "@/components/molecules/email-field";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { PasswordInput } from "@/components/molecules/password-input";
import { SubmitButton } from "@/components/molecules/submit-button";
import { AuthCard } from "@/components/organisms/auth-card";
import { signUp } from "@/lib/auth-client";
import { mapSignUpError } from "@/lib/auth-errors";
import { useResendVerification } from "@/lib/use-resend-verification";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [existingAccount, setExistingAccount] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null,
  );
  const { status: resend, resend: resendEmail } =
    useResendVerification(confirmationEmail);

  async function handleSubmit(formData: FormData) {
    setError("");
    setExistingAccount(false);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        const mapped = mapSignUpError(error);
        if (mapped.existingAccount) {
          setExistingAccount(true);
        }
        setError(mapped.message);
        return;
      }

      setConfirmationEmail(email);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez plus tard.");
    }
  }

  if (confirmationEmail) {
    return (
      <AuthCard
        title="Vérifiez votre boîte mail"
        subtitle="Une dernière étape avant votre première connexion"
      >
        <div className="space-y-6 text-center">
          <InlineAlert tone="info">
            Un lien de vérification vient d&apos;être envoyé à{" "}
            <strong className="font-semibold text-foreground">
              {confirmationEmail}
            </strong>
            . Ouvrez-le pour activer votre compte.
          </InlineAlert>

          <p className="text-sm leading-relaxed text-muted">
            Le lien est valable 1 heure. Pensez à vérifier vos spams si vous ne
            le trouvez pas.
          </p>

          {resend === "sent" ? (
            <InlineAlert tone="info">
              Si un compte existe avec cette adresse, un nouvel email de
              vérification vient de partir.
            </InlineAlert>
          ) : null}

          {resend !== "sent" ? (
            <>
              <Button
                onClick={resendEmail}
                disabled={resend === "sending"}
                size="lg"
                className="w-full"
              >
                {resend === "sending" && (
                  <Spinner className="h-4 w-4 border-primary-foreground/30 border-t-primary-foreground" />
                )}
                {resend === "sending"
                  ? "Envoi en cours..."
                  : "Renvoyer l'email de vérification"}
              </Button>

              {resend === "error" ? (
                <InlineAlert as="p" tone="danger">
                  L&apos;envoi a échoué. Vérifiez votre connexion, puis
                  réessayez.
                </InlineAlert>
              ) : null}
            </>
          ) : null}

          <Button href="/signin" size="lg" className="w-full">
            Aller à la connexion
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Créer un compte"
      subtitle="Rejoignez la console de remplacement Kineo"
    >
      <Form action={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="field-label">Nom complet</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Dr Jean Dupont"
            className="field-input"
          />
        </label>

        <EmailField />

        <label className="flex flex-col gap-2" htmlFor="password">
          <span className="flex items-center justify-between">
            <span className="field-label">Mot de passe</span>
            <span
              className={`text-xs transition-colors ${
                passwordLength >= 8 ? "font-medium text-primary" : "text-muted"
              }`}
            >
              {passwordLength >= 8
                ? "✓ Longueur suffisante"
                : "8 caractères min."}
            </span>
          </span>
          <PasswordInput
            name="password"
            id="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••••••"
            onInput={(event) =>
              setPasswordLength(event.currentTarget.value.length)
            }
          />
        </label>

        {error && (
          <InlineAlert as="p" tone="danger">
            {error}
          </InlineAlert>
        )}

        {error && existingAccount && (
          <p className="-mt-3 text-center text-sm">
            <Link
              href="/signin"
              className="font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Se connecter avec cet e-mail
            </Link>
          </p>
        )}

        <SubmitButton
          label="Créer mon compte"
          pendingLabel="Création du compte..."
        />

        <p className="text-center text-xs leading-relaxed text-muted">
          En créant un compte, vous acceptez nos{" "}
          <Link
            href="/terms"
            className="underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
          >
            conditions d&apos;utilisation
          </Link>
          .
        </p>
      </Form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà sur Kineo ?{" "}
        <Link
          href="/signin"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Se connecter
        </Link>
      </p>

      <div className="mt-4 text-center">
        <Button href="/" variant="ghost">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Accueil</span>
        </Button>
      </div>
    </AuthCard>
  );
}
