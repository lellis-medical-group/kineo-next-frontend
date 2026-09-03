"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { joinCta } from "@/lib/marketing";

/**
 * Redirects to signup with the email pre-filled (`?email=` query),
 * which the signup page will be able to consume later.
 */
export function SignupEmailForm() {
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
          placeholder={joinCta.emailPlaceholder}
          className="field-input"
        />
      </label>
      <Button type="submit">{joinCta.submitLabel}</Button>
    </form>
  );
}
