"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/organisms/error-state";
import { ApplicationsView } from "@/components/templates/applications-view";
import {
  type ApplicationsData,
  fetchApplicationsData,
} from "@/lib/applications";

type Status = "loading" | "error" | "success";

/**
 * Orchestrator for /applications: fetches data (loading/error/success) and
 * delegates rendering to ApplicationsView. Lives in `templates/` — organisms
 * must never import templates.
 */
export function ApplicationsContainer() {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<ApplicationsData | null>(null);
  const [error, setError] = useState<string>("");

  const load = useCallback(() => {
    setStatus("loading");
    setError("");

    fetchApplicationsData()
      .then((applicationsData) => {
        setData(applicationsData);
        setStatus("success");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") {
    return <ApplicationsSkeleton />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!data) {
    return null;
  }

  return <ApplicationsView data={data} />;
}

/** Static keys for the skeleton placeholders (no index keys). */
const SKELETON_CHIPS = ["chip-1", "chip-2", "chip-3", "chip-4", "chip-5"];
const SKELETON_CARDS = ["card-1", "card-2", "card-3"];

function ApplicationsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-9 w-64 animate-pulse rounded-control bg-surface" />
      <div className="h-5 w-96 max-w-full animate-pulse rounded-control bg-surface" />
      <div className="mt-6 flex flex-wrap gap-2">
        {SKELETON_CHIPS.map((key) => (
          <div
            key={key}
            className="h-8 w-24 animate-pulse rounded-full bg-surface"
          />
        ))}
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          {SKELETON_CARDS.map((key) => (
            <div
              key={key}
              className="h-32 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>
        <div className="hidden h-96 animate-pulse rounded-2xl bg-surface lg:block" />
      </div>
    </div>
  );
}
