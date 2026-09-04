"use client";

import { Button } from "@/components/atoms/button";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { StatusCard } from "@/components/molecules/status-card";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusCard
      code="500"
      message="Quelque chose s’est mal passé. Réessayez ou revenez à l’accueil."
    >
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="secondary" onClick={reset}>
          Réessayer
        </Button>
        <Button href="/">
          <ArrowLeftIcon className="h-4 w-4" />
          Accueil
        </Button>
      </div>
    </StatusCard>
  );
}
