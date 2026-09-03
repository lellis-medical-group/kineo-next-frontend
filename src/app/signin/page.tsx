"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { PasswordInput } from "@/components/molecules/password-input";
import { AuthCard } from "@/components/organisms/auth-card";
import { signIn } from "@/lib/auth-client";

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
      {pending ? "Connexion en cours..." : "Se connecter"}
    </button>
  );
}

/**
 * Convertit une erreur better-auth en message français compréhensible.
 * Vérifie `error.code` en priorité, puis `error.message`.
 */
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
        // Serveur indisponible (pas de statut ou 5xx)
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
      // Erreur réseau ou exception inattendue
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
          <p
            role="alert"
            className="rounded-control border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <SubmitButton />
      </Form>

      <p className="mt-7 text-center text-sm text-muted">
        Nouveau sur Kineo ?{" "}
        <a
          href="/signup"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Créer un compte
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
