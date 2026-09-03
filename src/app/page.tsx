"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
        <h1 className="font-serif text-4xl font-semibold text-foreground">
          Welcome
        </h1>

        <p className="max-w-md text-center text-lg text-foreground/60">
          Sign in to access your personal space or create an account to get
          started.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="rounded-md bg-foreground px-6 py-3 text-base font-semibold text-background transition hover:opacity-90"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="rounded-md border border-foreground/20 px-6 py-3 text-base font-semibold text-foreground transition hover:bg-foreground/5"
          >
            Sign up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background p-8 text-foreground">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between border-b border-foreground/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground font-serif text-xl font-semibold text-background">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold">
              {session.user.name}
            </h2>
            <p className="text-sm text-foreground/60">{session.user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="rounded-md border border-red-500/30 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
        >
          Sign out
        </button>
      </header>

      <div className="mx-auto mt-12 w-full max-w-4xl">
        <h1 className="mb-6 font-serif text-3xl font-semibold">Dashboard</h1>

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
