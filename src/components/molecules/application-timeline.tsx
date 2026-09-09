import type { ApplicationEntry } from "@/lib/applications";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";

interface TimelineEvent {
  label: string;
  date: string;
  /** Dot color — semantic: sent (primary), viewed (success), answered (info). */
  dotClass: string;
}

/** Submission / viewed / responded timeline for an application. */
export function ApplicationTimeline({
  application,
}: {
  application: ApplicationEntry;
}) {
  const events: TimelineEvent[] = [
    {
      label: "Candidature envoyée",
      date: formatDateTime(application.createdAt),
      dotClass: "bg-primary",
    },
  ];

  if (application.viewedAt) {
    events.push({
      label: "Consultée par le cabinet",
      date: formatDateTime(application.viewedAt),
      dotClass: "bg-success",
    });
  }

  if (application.respondedAt) {
    events.push({
      label: "Réponse du cabinet",
      date: formatDateTime(application.respondedAt),
      dotClass: "bg-info",
    });
  }

  return (
    <section>
      <h2 className="text-sm font-bold text-foreground">Suivi</h2>
      {/* Vertical connector between the dots — only meaningful with 2+ events. */}
      <ol
        className={cn(
          "relative mt-3 space-y-4",
          events.length > 1 &&
            "before:absolute before:bottom-2.5 before:left-[3.5px] before:top-2.5 before:w-px before:bg-border",
        )}
      >
        {events.map((event) => (
          <li key={event.label} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                event.dotClass,
              )}
            />
            <div className="min-w-0">
              <p className="text-sm text-foreground">{event.label}</p>
              <p className="text-xs text-muted">{event.date}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
