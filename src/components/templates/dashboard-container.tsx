"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/organisms/error-state";
import { MemberHome } from "@/components/templates/member-home";
import { type DashboardData, fetchDashboardData } from "@/lib/dashboard";

type Status = "loading" | "error" | "success";

/**
 * Orchestrator for the logged-in page: fetches data (loading/error/success)
 * and delegates rendering to MemberHome. Lives in `templates/` — organisms
 * must never import templates.
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
    return <ErrorState message={error} onRetry={load} />;
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
          {/* Greeting */}
          <div className="h-28 animate-pulse rounded-control bg-surface" />
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-32 animate-pulse rounded-control bg-surface" />
            <div className="h-32 animate-pulse rounded-control bg-surface" />
            <div className="h-32 animate-pulse rounded-control bg-surface" />
          </div>
          {/* Activity */}
          <div className="h-64 animate-pulse rounded-control bg-surface" />
        </div>
        {/* Sidebar */}
        <aside className="h-96 animate-pulse rounded-control bg-surface" />
      </div>
    </div>
  );
}
