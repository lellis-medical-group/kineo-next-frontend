"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@/components/atoms/icons";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <div className="card p-10 w-full max-w-md text-center">
        <h1 className="text-5xl font-medium tracking-[-0.02em]">500</h1>
        <p className="mt-4 text-sm text-muted">
          Quelque chose s’est mal passé. Réessayez ou revenez à l’accueil.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn btn-secondary"
            aria-label="Réessayer"
          >
            Réessayer
          </button>
          <Link href="/" className="btn btn-primary" aria-label="Accueil">
            <ArrowLeftIcon className="h-4 w-4" />
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
