import { Avatar } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { type ApplicationEntry, STATUS_META } from "@/lib/applications";
import { cn } from "@/lib/cn";

interface ApplicationCardProps {
  application: ApplicationEntry;
  selected: boolean;
  onSelect: (id: string) => void;
}

/**
 * One application in the list column — mirrors the design template:
 * identity block, message excerpt, viewed indicator and status badge.
 */
export function ApplicationCard({
  application,
  selected,
  onSelect,
}: ApplicationCardProps) {
  const meta = STATUS_META[application.status];

  return (
    <button
      type="button"
      onClick={() => onSelect(application.id)}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition-colors sm:p-5",
        selected
          ? "border-primary/70 bg-surface-2"
          : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            name={application.listing.practiceName ?? application.listing.title}
            className="h-9 w-9 text-xs"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {application.listing.title}
            </p>
            <p className="text-xs text-muted">{application.submittedLabel}</p>
          </div>
        </div>
        <Badge tone={meta.badgeTone}>{meta.label}</Badge>
      </div>

      {application.message && (
        <p className="mt-3 truncate text-sm text-muted">
          « {application.message} »
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
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
        <span className="shrink-0 text-xs text-faint">
          Cliquer pour détails →
        </span>
      </div>
    </button>
  );
}
