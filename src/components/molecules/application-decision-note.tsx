import { AlertIcon } from "@/components/atoms/icons";
import type { ApplicationEntry } from "@/lib/applications";

/** Rejection or withdrawal note, shown only for the matching status. */
export function ApplicationDecisionNote({
  application,
}: {
  application: ApplicationEntry;
}) {
  if (application.status === "REJECTED") {
    return (
      <div className="rounded-control border border-danger/20 bg-danger/10 p-4">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-danger">
          <AlertIcon className="h-4 w-4 shrink-0" />
          Motif du refus
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          {application.rejectionReason ??
            "Aucun motif n'a été communiqué par le cabinet."}
        </p>
      </div>
    );
  }

  if (application.status === "WITHDRAWN") {
    return (
      <div className="rounded-control border border-border bg-surface-2 p-4">
        <h2 className="text-sm font-bold text-foreground">Motif du retrait</h2>
        <p className="mt-1.5 text-sm text-muted">
          {application.withdrawnReason ??
            "Vous avez retiré cette candidature sans préciser de motif."}
        </p>
      </div>
    );
  }

  return null;
}
