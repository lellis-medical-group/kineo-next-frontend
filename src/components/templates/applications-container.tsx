"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/organisms/error-state";
import { ApplicationsView } from "@/components/templates/applications-view";
import {
  type ApplicationsData,
  type ApplicationsFilter,
  fetchApplicationsData,
} from "@/lib/applications";

type Status = "loading" | "error" | "success";

const DEFAULT_PAGE_SIZE = 5;

/** Orchestrator for /applications — fetches data (loading/error/success) and renders ApplicationsView. */
export function ApplicationsContainer() {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<ApplicationsData | null>(null);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<ApplicationsFilter>("ALL");

  const load = useCallback(() => {
    setStatus("loading");
    setError("");

    fetchApplicationsData({
      page,
      limit: DEFAULT_PAGE_SIZE,
      status: filter !== "ALL" ? filter : undefined,
    })
      .then((applicationsData) => {
        setData(applicationsData);
        setStatus("success");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setStatus("error");
      });
  }, [page, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleFilterChange = useCallback((newFilter: ApplicationsFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  }, []);

  // Keep previous data on refetch so the tab counters don't flash.
  if (status === "loading" && !data) {
    return <ApplicationsSkeleton />;
  }

  if (status === "error" && !data) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!data) {
    return null;
  }

  return (
    <ApplicationsView
      data={data}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
      currentFilter={filter}
    />
  );
}

/** Static skeleton keys — no index keys. */
const SKELETON_CHIPS = [
  "chip-1",
  "chip-2",
  "chip-3",
  "chip-4",
  "chip-5",
  "chip-6",
];
const SKELETON_CARDS = ["card-1", "card-2", "card-3"];

function ApplicationsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-9 w-64 animate-pulse rounded-control bg-surface" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-control bg-surface" />
      <div className="mt-6 flex flex-wrap gap-2">
        {SKELETON_CHIPS.map((key) => (
          <div
            key={key}
            className="h-8 w-24 animate-pulse rounded-full bg-surface"
          />
        ))}
      </div>
      <div className="mt-8 space-y-5">
        {SKELETON_CARDS.map((key) => (
          <div
            key={key}
            className="h-36 animate-pulse rounded-2xl bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
