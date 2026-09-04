"use client";

import Form from "next/form";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { PasswordInput } from "@/components/molecules/password-input";
import { AuthCard } from "@/components/organisms/auth-card";
import { sendVerificationEmail, signUp } from "@/lib/auth-client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary mt-2 w-full py-3.5 text-[0.9375rem]"
    >
      {pending && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
        />
      )}
      {pending ? "Création du compte..." : "Créer mon compte"}
    </button>
  );
}

type ResendStatus = "idle" | "sending" | "sent" | "error";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [existingAccount, setExistingAccount] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null,
  );
  const [resend, setResend] = useState<ResendStatus>("idle");

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
        const message = (error.message ?? "").toLowerCase();
        if (
          message.includes("already exists") ||
          message.includes("user exists")
        ) {
          setExistingAccount(true);
          setError(
            "Un compte existe déjà avec cet e-mail. Vous pouvez vous connecter directement.",
          );
        } else if (
          message.includes("too short") ||
          message.includes("too long")
        ) {
          setError("Le mot de passe doit contenir entre 8 et 128 caractères.");
        } else {
          setError(
            "Inscription impossible pour le moment. Vérifiez votre connexion, puis réessayez.",
          );
        }
        return;
      }

      setConfirmationEmail(email);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez plus tard.");
    }
  }

  async function handleResend() {
    if (!confirmationEmail) {
      return;
    }

    setResend("sending");
    try {
      const { error } = await sendVerificationEmail({
        email: confirmationEmail,
      });
      setResend(error ? "error" : "sent");
    } catch {
      setResend("error");
    }
  }

  if (confirmationEmail) {
    return (
      <AuthCard
        title="Vérifiez votre boîte mail"
        subtitle="Une dernière étape avant votre première connexion"
      >
        <div className="space-y-6 text-center">
          <output className="block rounded-lg border border-primary/30 bg-primary/10 px-4 py-3.5 text-sm leading-relaxed">
            Un lien de vérification vient d&apos;être envoyé à{" "}
            <strong className="font-semibold text-foreground">
              {confirmationEmail}
            </strong>
            . Ouvrez-le pour activer votre compte.
          </output>

          <p className="text-sm leading-relaxed text-muted">
            Le lien est valable 1 heure. Pensez à vérifier vos spams si vous ne
            le trouvez pas.
          </p>

          {resend === "sent" ? (
            <output className="block rounded-lg border border-primary/30 bg-primary/10 px-4 py-3.5 text-sm leading-relaxed">
              Si un compte existe avec cette adresse, un nouvel email de
              vérification vient de partir.
            </output>
          ) : null}

          {resend !== "sent" ? (
            <>
              <button
                type="button"
                onClick={handleResend}
                disabled={resend === "sending"}
                className="flex w-full items-center justify-center gap-2.5 rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-60"
              >
                {resend === "sending" && (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                  />
                )}
                {resend === "sending"
                  ? "Envoi en cours..."
                  : "Renvoyer l'email de vérification"}
              </button>

              {resend === "error" ? (
                <p
                  role="alert"
                  className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
                >
                  L&apos;envoi a échoué. Vérifiez votre connexion, puis
                  réessayez.
                </p>
              ) : null}
            </>
          ) : null}

          <a
            href="/signin"
            className="flex w-full items-center justify-center rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Aller à la connexion
          </a>
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

        <label className="flex flex-col gap-2">
          <span className="field-label">Adresse e-mail</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jean.dupont@exemple.fr"
            className="field-input"
          />
        </label>

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
          <p
            role="alert"
            className="rounded-control border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}

        {error && existingAccount && (
          <p className="-mt-3 text-center text-sm">
            <a
              href="/signin"
              className="font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Se connecter avec cet e-mail
            </a>
          </p>
        )}

        <SubmitButton />

        <p className="text-center text-xs leading-relaxed text-muted">
          En créant un compte, vous acceptez nos{" "}
          <a
            href="/terms"
            className="underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
          >
            conditions d&apos;utilisation
          </a>
          .
        </p>
      </Form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà sur Kineo ?{" "}
        <a
          href="/signin"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Se connecter
        </a>
      </p>

      <div className="mt-4 text-center">
        <a href="/" className="btn btn-ghost" aria-label="Retour à l'accueil">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Accueil</span>
        </a>
      </div>
    </AuthCard>
  );
}
