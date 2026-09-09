import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { CalendarIcon } from "@/components/atoms/icons";
import { ApplicationCardFooter } from "@/components/molecules/application-card-footer";
import { ApplicationCardMeta } from "@/components/molecules/application-card-meta";
import { type ApplicationEntry, STATUS_META } from "@/lib/applications";

/** One application in the list — whole-card link to its detail page. */
export function ApplicationCard({
  application,
}: {
  application: ApplicationEntry;
}) {
  const meta = STATUS_META[application.status];
  const { dateRange } = application.listing;

  return (
    <Link
      href={`/applications/${application.id}`}
      className="group block w-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-surface-hover sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-bold leading-snug text-foreground sm:text-lg">
            {application.listing.title}
          </p>
          <ApplicationCardMeta application={application} />
        </div>
        <Badge tone={meta.badgeTone} className="shrink-0">
          {meta.label}
        </Badge>
      </div>

      {dateRange && (
        <p className="mt-4 flex items-center gap-2 text-sm text-foreground">
          <CalendarIcon className="h-4 w-4 shrink-0 text-faint" />
          {dateRange}
        </p>
      )}

      {application.message && (
        <p className="mt-4 line-clamp-2 rounded-xl bg-background/40 px-4 py-3 text-sm leading-relaxed text-muted">
          « {application.message} »
        </p>
      )}

      <ApplicationCardFooter application={application} />
    </Link>
  );
}
