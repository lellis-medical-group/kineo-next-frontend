import { ArrowRightIcon } from "@/components/atoms/icons";
import type { ApplicationEntry } from "@/lib/applications";
import { cn } from "@/lib/cn";

/** Card footer: viewed indicator and the link to the detail page. */
export function ApplicationCardFooter({
  application,
}: {
  application: ApplicationEntry;
}) {
  return (
    <div className="mt-5 flex items-center justify-between gap-4">
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
  );
}
