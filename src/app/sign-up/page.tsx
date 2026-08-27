"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-md bg-foreground py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-50"
    >
      {pending ? "Creating..." : "Create my account"}
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
        setError(error.message || "Registration failed");
        return;
      }

      router.push("/");
    } catch {
      setError("Unable to contact the server. Please try again later.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-background text-foreground">
      <Form
        action={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
          Sign Up
        </span>

        <h1 className="mb-1 font-serif text-3xl font-semibold text-foreground">
          Create an account
        </h1>
        <p className="-mt-3 text-sm text-foreground/60">
          Join us in a few seconds.
        </p>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground/80">
          Name
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="John Doe"
            className="rounded-md border border-foreground/15 bg-foreground/[0.03] px-3.5 py-3 text-base text-foreground outline-none transition placeholder:text-foreground/30 focus:border-foreground focus:bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground/80">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-md border border-foreground/15 bg-foreground/[0.03] px-3.5 py-3 text-base text-foreground outline-none transition placeholder:text-foreground/30 focus:border-foreground focus:bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground/80">
          <span className="flex items-center justify-between">
            Password
            <span className="text-xs font-normal text-foreground/50">
              Min. 8 characters
            </span>
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
            className="rounded-md border border-foreground/15 bg-foreground/[0.03] px-3.5 py-3 text-base text-foreground outline-none transition placeholder:text-foreground/30 focus:border-foreground focus:bg-transparent"
          />
        </label>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <SubmitButton />

        <p className="mt-2 text-center text-xs text-foreground/50">
          By creating an account, you agree to our{" "}
          <a
            href="/terms"
            className="border-b border-foreground/30 hover:border-foreground"
          >
            terms of service
          </a>
          .
        </p>

        <p className="text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="border-b border-foreground font-semibold text-foreground hover:opacity-70"
          >
            Sign in
          </a>
        </p>
      </Form>
    </main>
  );
}
