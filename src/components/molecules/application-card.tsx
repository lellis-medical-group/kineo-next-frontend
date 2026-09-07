import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { ArrowRightIcon } from "@/components/atoms/icons";
import { type ApplicationEntry, STATUS_META } from "@/lib/applications";
import { cn } from "@/lib/cn";

/**
 * One application in the list — a whole-card link to its dedicated detail
 * page (`/applications/{id}`): listing title, submission/practice line,
 * message excerpt, viewed indicator and status badge, kept airy.
 */
export function ApplicationCard({
  application,
}: {
  application: ApplicationEntry;
}) {
  const meta = STATUS_META[application.status];
  const { practiceName, practiceCity } = application.listing;
  const metaLine = [application.submittedLabel, practiceName, practiceCity]
    .filter((part): part is string => Boolean(part))
    .join(" · ");

  return (
    <Link
      href={`/applications/${application.id}`}
      className="group block w-full rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-hover sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-bold text-foreground">
            {application.listing.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted">{metaLine}</p>
        </div>
        <Badge tone={meta.badgeTone} className="shrink-0">
          {meta.label}
        </Badge>
      </div>

      {application.message && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">
          « {application.message} »
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              application.viewed ? "bg-success" : "bg-danger",
            )}
          />
          <span className="status-text">
            {application.viewed ? "Consultée" : "Non consultée"}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-faint transition-colors group-hover:text-primary">
          Voir le détail
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
