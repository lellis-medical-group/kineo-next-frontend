"use client";

import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/molecules/loading-state";
import { ErrorState } from "@/components/organisms/error-state";
import { ApplicationDetailView } from "@/components/templates/application-detail-view";
import {
  type ApplicationEntry,
  fetchApplicationDetail,
} from "@/lib/applications";

type Status = "loading" | "error" | "success";

/** Orchestrator for /applications/[id] — fetches one application and renders ApplicationDetailView. */
export function ApplicationDetailContainer({ id }: { id: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [application, setApplication] = useState<ApplicationEntry | null>(null);
  const [error, setError] = useState<string>("");

  const load = useCallback(() => {
    setStatus("loading");
    setError("");

    fetchApplicationDetail(id)
      .then((entry) => {
        setApplication(entry);
        setStatus("success");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setStatus("error");
      });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Instant update when the API echoes the entry, refetch otherwise.
  const handleWithdrawn = useCallback(
    (updated: ApplicationEntry | null) => {
      if (updated) {
        setApplication(updated);
      } else {
        load();
      }
    },
    [load],
  );

  if (status === "loading") {
    return <LoadingState className="min-h-[60vh]" />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!application) {
    return null;
  }

  return (
    <ApplicationDetailView
      application={application}
      onWithdrawn={handleWithdrawn}
    />
  );
}
