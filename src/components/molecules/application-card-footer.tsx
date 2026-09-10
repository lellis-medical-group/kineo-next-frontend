import { ArrowRightIcon } from "@/components/atoms/icons";
import type { ApplicationEntry } from "@/lib/applications";
import { cn } from "@/lib/cn";

/** Card state row under a divider: viewed indicator, submission time, CTA. */
export function ApplicationCardFooter({
  application,
}: {
  application: ApplicationEntry;
}) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            application.viewed ? "bg-success" : "bg-danger",
          )}
        />
        <span className="status-text whitespace-nowrap">
          {application.viewed ? "Consultée" : "Non consultée"}
        </span>
        <span className="truncate text-xs text-faint">
          · {application.submittedLabel}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-faint transition-colors group-hover:text-primary">
        Voir le détail
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </div>
  );
}
