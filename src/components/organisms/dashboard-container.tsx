"use client";

import { useCallback, useEffect, useState } from "react";
import { MemberHome } from "@/components/templates/member-home";
import type { DashboardData } from "@/lib/dashboard";
import { fetchDashboardData } from "@/lib/dashboard-service";

type Status = "loading" | "error" | "success";

/**
 * Conteneur côté client du tableau de bord : orchestre le chargement des
 * données (loading / erreur / succès) et délègue le rendu à MemberHome.
 */
export function DashboardContainer({ userName }: { userName?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>("");

  const load = useCallback(() => {
    setStatus("loading");
    setError("");

    fetchDashboardData(userName)
      .then((dashboardData) => {
        setData(dashboardData);
        setStatus("success");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        setStatus("error");
      });
  }, [userName]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (status === "error") {
    return <DashboardError message={error} onRetry={load} />;
  }

  if (!data) {
    return null;
  }

  return <MemberHome data={data} />;
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {/* Greeting skeleton */}
          <div className="h-28 animate-pulse rounded-control bg-surface" />
          {/* Stats skeleton */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-32 animate-pulse rounded-control bg-surface" />
            <div className="h-32 animate-pulse rounded-control bg-surface" />
            <div className="h-32 animate-pulse rounded-control bg-surface" />
          </div>
          {/* Activity skeleton */}
          <div className="h-64 animate-pulse rounded-control bg-surface" />
        </div>
        {/* Sidebar skeleton */}
        <aside className="h-96 animate-pulse rounded-control bg-surface" />
      </div>
    </div>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-danger/10 p-4">
        <svg
          className="h-8 w-8 text-danger"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        Impossible de charger vos données
      </h2>
      <p className="mb-2 text-sm text-muted">
        {message.includes("401") || message.includes("403")
          ? "Votre session a expiré. Veuillez vous reconnecter."
          : "Le service est temporairement indisponible. Veuillez réessayer."}
      </p>
      {isDev && message && (
        <p className="mb-4 max-w-sm wrap-break-word rounded bg-surface px-3 py-2 font-mono text-xs text-muted">
          [dev] {message}
        </p>
      )}
      <button
        type="button"
        onClick={onRetry}
        className="btn btn-primary px-6 py-2.5"
      >
        Réessayer
      </button>
    </div>
  );
}
