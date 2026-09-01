"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/lib/auth-client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-md bg-foreground py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-50"
    >
      {pending ? "Signing in..." : "Sign in"}
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
      setError(error.message || "Invalid credentials");
      return;
    }

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-background text-foreground">
      <Form
        action={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
          Sign In
        </span>

        <h1 className="mb-1 font-serif text-3xl font-semibold text-foreground">
          Welcome back
        </h1>

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
            <a
              href="/forgot-password"
              className="text-xs font-normal text-foreground/60 hover:text-foreground"
            >
              Forgot?
            </a>
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
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

        <p className="mt-2 text-center text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="border-b border-foreground font-semibold text-foreground hover:opacity-70"
          >
            Sign up
          </a>
        </p>
      </Form>
    </main>
  );
}
