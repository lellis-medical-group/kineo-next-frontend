"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { AuthCard } from "@/components/auth-card";
import { PasswordInput } from "@/components/password-input";
import { signUp } from "@/lib/auth-client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-[0.625rem] bg-primary py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Création..." : "Créer mon compte"}
    </button>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
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
        setError(error.message || "Inscription impossible. Réessayez.");
        return;
      }

      router.push("/");
    } catch {
      setError("Impossible de contacter le serveur. Réessayez plus tard.");
    }
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
            placeholder="Dr Julien Martin"
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
            placeholder="dr.julien.martin@gmail.com"
            className="field-input"
          />
        </label>

        <label className="flex flex-col gap-2" htmlFor="password">
          <span className="flex items-center justify-between">
            <span className="field-label">Mot de passe</span>
            <span className="text-xs text-muted">8 caractères min.</span>
          </span>
          <PasswordInput
            name="password"
            id="password"
            required
            minLength={8}
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
          className="font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Se connecter
        </a>
      </p>
    </AuthCard>
  );
}
