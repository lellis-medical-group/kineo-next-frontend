import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { ApplicationCardFooter } from "@/components/molecules/application-card-footer";
import { ApplicationCardMeta } from "@/components/molecules/application-card-meta";
import { type ApplicationEntry, STATUS_META } from "@/lib/applications";

/**
 * One application in the list — a whole-card link to its detail page: title,
 * meta, message excerpt, viewed indicator and status badge.
 */
export function ApplicationCard({
  application,
}: {
  application: ApplicationEntry;
}) {
  const meta = STATUS_META[application.status];

  return (
    <Link
      href={`/applications/${application.id}`}
      className="group block w-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-surface-hover sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-bold text-foreground">
            {application.listing.title}
          </p>
          <ApplicationCardMeta application={application} />
        </div>
        <Badge tone={meta.badgeTone} className="shrink-0">
          {meta.label}
        </Badge>
      </div>

      {application.message && (
        <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-muted">
          « {application.message} »
        </p>
      )}

      <ApplicationCardFooter application={application} />
    </Link>
  );
}
