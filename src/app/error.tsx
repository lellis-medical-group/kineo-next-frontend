"use client";

import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { ArrowLeftIcon } from "@/components/atoms/icons";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md p-10 text-center">
        <h1 className="text-5xl font-medium tracking-[-0.02em]">500</h1>
        <p className="mt-4 text-sm text-muted">
          Quelque chose s’est mal passé. Réessayez ou revenez à l’accueil.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={reset}>
            Réessayer
          </Button>
          <Button href="/">
            <ArrowLeftIcon className="h-4 w-4" />
            Accueil
          </Button>
        </div>
      </Card>
    </main>
  );
}
