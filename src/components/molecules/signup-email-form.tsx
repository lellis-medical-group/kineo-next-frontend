"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/atoms/button";

export interface SignupEmailFormProps {
  placeholder?: string;
  submitLabel?: string;
}

/**
 * Redirige vers l'inscription avec l'e-mail pré-rempli (`?email=`).
 */
export function SignupEmailForm({
  placeholder = "prenom.nom@exemple.fr",
  submitLabel = "Commencer",
}: SignupEmailFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/signup?email=${encodeURIComponent(email)}`);
      }}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <label className="flex-1">
        <span className="sr-only">Adresse e-mail</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          className="field-input"
        />
      </label>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
