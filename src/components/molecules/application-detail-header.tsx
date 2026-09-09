import { MapPinIcon } from "@/components/atoms/icons";
import type { ApplicationEntry } from "@/lib/applications";

/** Listing title and targeted practice — the status lives in the banner below. */
export function ApplicationDetailHeader({
  application,
}: {
  application: ApplicationEntry;
}) {
  const { listing } = application;
  const practiceLabel = listing.practiceName
    ? `${listing.practiceName}${listing.practiceCity ? ` · ${listing.practiceCity}` : ""}`
    : listing.practiceCity;

  return (
    <div className="min-w-0">
      <h1 className="text-2xl font-bold leading-snug tracking-tight text-foreground">
        {listing.title}
      </h1>
      {practiceLabel && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
          <MapPinIcon className="h-4 w-4 shrink-0 text-faint" />
          <span className="truncate">{practiceLabel}</span>
        </p>
      )}
    </div>
  );
}
