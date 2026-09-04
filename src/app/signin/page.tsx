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
import {
  AUTH_SERVICE_UNAVAILABLE_MESSAGE,
  isAuthServiceUnavailable,
  mapNetworkSignInError,
  mapSignInError,
} from "@/lib/auth-errors";

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
        if (isAuthServiceUnavailable(error)) {
          setError(AUTH_SERVICE_UNAVAILABLE_MESSAGE);
          return;
        }
        setError(mapSignInError(error));
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      // Network error or unexpected exception
      setError(mapNetworkSignInError(err));
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
