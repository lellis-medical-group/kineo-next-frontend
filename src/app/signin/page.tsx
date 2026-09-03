"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { AuthCard } from "@/components/auth-card";
import { PasswordInput } from "@/components/password-input";
import { signIn } from "@/lib/auth-client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Connexion..." : "Se connecter"}
    </button>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      setError(
        error.message === "Invalid email or password"
          ? "E-mail ou mot de passe incorrect."
          : (error.message ?? "Connexion impossible. Réessayez."),
      );
      return;
    }

    router.push("/");
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
            placeholder="dr.julien.martin@gmail.com"
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
            className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
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
          className="font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Créer un compte
        </a>
      </p>
    </AuthCard>
  );
}
