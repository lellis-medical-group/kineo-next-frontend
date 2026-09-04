"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { PasswordInput } from "@/components/molecules/password-input";
import { SubmitButton } from "@/components/molecules/submit-button";
import { AuthCard } from "@/components/organisms/auth-card";
import { signIn } from "@/lib/auth-client";

/** Maps a better-auth error to a user-friendly French message. Checks `error.code` first, then `error.message`. */
function mapAuthError(error: { code?: string; message?: string }): string {
  const code = error.code?.toUpperCase();
  const message = error.message?.toUpperCase() || "";

  if (
    code === "EMAIL_NOT_VERIFIED" ||
    message.includes("EMAIL NOT VERIFIED") ||
    message.includes("EMAIL_NOT_VERIFIED")
  ) {
    return "Adresse e-mail non vérifiée. Consultez votre boîte de réception et cliquez sur le lien de vérification pour activer votre compte.";
  }

  if (
    code === "INVALID_EMAIL_OR_PASSWORD" ||
    message.includes("INVALID EMAIL OR PASSWORD")
  ) {
    return "E-mail ou mot de passe incorrect. Vérifiez votre saisie, puis réessayez.";
  }

  return "Connexion impossible pour le moment. Vérifiez votre connexion, puis réessayez.";
}

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        // Server unavailable (no status or 5xx)
        if (!error.status || error.status >= 500) {
          setError(
            "Service d'authentification indisponible. Veuillez réessayer dans quelques instants.",
          );
          return;
        }
        setError(mapAuthError(error));
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      // Network error or unexpected exception
      const message = err instanceof Error ? err.message?.toUpperCase() : "";
      if (
        message.includes("EMAIL NOT VERIFIED") ||
        message.includes("EMAIL_NOT_VERIFIED")
      ) {
        setError(
          "Adresse e-mail non vérifiée. Consultez votre boîte de réception et cliquez sur le lien de vérification pour activer votre compte.",
        );
        return;
      }
      setError(
        "Service d'authentification indisponible. Veuillez réessayer dans quelques instants.",
      );
    }
  }

  return (
    <AuthCard
      title="Connexion"
      subtitle="Accédez à la console de remplacement Kineo"
    >
      <Form action={handleSubmit} className="flex flex-col gap-5">
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
            <a
              href="/forgot-password"
              className="text-xs text-muted transition-colors hover:text-primary"
            >
              Oublié ?
            </a>
          </span>
          <PasswordInput
            name="password"
            id="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
          />
        </label>

        {error && (
          <InlineAlert as="p" tone="danger">
            {error}
          </InlineAlert>
        )}

        <SubmitButton
          label="Se connecter"
          pendingLabel="Connexion en cours..."
        />
      </Form>

      <p className="mt-7 text-center text-sm text-muted">
        Nouveau sur Kineo ?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Créer un compte
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
