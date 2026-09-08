import type { ApplicationEntry } from "@/lib/applications";
import { formatDateTime } from "@/lib/format";

/** Submission / viewed / responded timeline for an application. */
export function ApplicationTimeline({
  application,
}: {
  application: ApplicationEntry;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold text-foreground">Suivi</h2>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        <li>
          Envoyée le{" "}
          <strong className="font-bold text-foreground">
            {formatDateTime(application.createdAt)}
          </strong>
        </li>
        {application.viewedAt && (
          <li>
            Consultée par le cabinet le{" "}
            <strong className="font-bold text-foreground">
              {formatDateTime(application.viewedAt)}
            </strong>
          </li>
        )}
        {application.respondedAt && (
          <li>
            Réponse du cabinet le{" "}
            <strong className="font-bold text-foreground">
              {formatDateTime(application.respondedAt)}
            </strong>
          </li>
        )}
      </ul>
    </section>
  );
}
