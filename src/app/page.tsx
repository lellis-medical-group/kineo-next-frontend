"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-10 text-foreground sm:p-8">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Welcome
        </h1>

        <p className="max-w-md text-center text-lg text-foreground/60">
          Sign in to access your personal space or create an account to get
          started.
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="w-full rounded-md bg-foreground px-6 py-3 text-base font-semibold text-background transition hover:opacity-90 sm:w-auto"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-full rounded-md border border-foreground/20 px-6 py-3 text-base font-semibold text-foreground transition hover:bg-foreground/5 sm:w-auto"
          >
            Sign up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background px-4 py-6 text-foreground sm:p-8">
      <header className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-semibold text-background">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">
              {session.user.name}
            </h2>
            <p className="truncate text-sm text-foreground/60">
              {session.user.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="shrink-0 rounded-md border border-danger/30 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10"
        >
          Sign out
        </button>
      </header>

      <div className="mx-auto mt-8 w-full max-w-4xl sm:mt-12">
        <h1 className="mb-6 text-3xl font-semibold">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-foreground/10 bg-foreground/2 p-6">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-foreground/50">
              Account Information
            </h3>

            <div className="space-y-2 text-foreground/80">
              <p>
                <strong>Name:</strong> {session.user.name}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              <p>
                <strong>Email verified:</strong>{" "}
                {session.user.emailVerified ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-foreground/10 bg-foreground/2 p-6">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-foreground/50">
              Session Status
            </h3>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-foreground/80">Active session</span>
            </div>

            <p className="mt-4 text-sm text-foreground/60">
              Session ID:{" "}
              <span className="font-mono text-foreground/80">
                {session.session.id.slice(0, 8)}...
              </span>
            </p>

            <p className="mt-2 text-sm text-foreground/60">
              Expires on:{" "}
              <span className="font-mono text-foreground/80">
                {new Date(session.session.expiresAt).toLocaleDateString(
                  "en-US",
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
