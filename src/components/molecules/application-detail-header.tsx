import { Badge } from "@/components/atoms/badge";
import { type ApplicationEntry, STATUS_META } from "@/lib/applications";

/** Detail page header: listing title, practice label and status badge. */
export function ApplicationDetailHeader({
  application,
}: {
  application: ApplicationEntry;
}) {
  const meta = STATUS_META[application.status];
  const { listing } = application;
  const practiceLabel = listing.practiceName
    ? `${listing.practiceName}${listing.practiceCity ? ` · ${listing.practiceCity}` : ""}`
    : listing.practiceCity;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-foreground">
          {listing.title}
        </h1>
        {practiceLabel && (
          <p className="truncate text-sm text-muted">{practiceLabel}</p>
        )}
      </div>
      <Badge tone={meta.badgeTone} className="shrink-0">
        {meta.label}
      </Badge>
    </div>
  );
}
