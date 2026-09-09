import { MapPinIcon } from "@/components/atoms/icons";
import type { ApplicationEntry } from "@/lib/applications";

/** Practice (name · city) under the title; falls back to the submission time. */
export function ApplicationCardMeta({
  application,
}: {
  application: ApplicationEntry;
}) {
  const { practiceName, practiceCity } = application.listing;
  const practiceLabel = practiceName
    ? `${practiceName}${practiceCity ? ` · ${practiceCity}` : ""}`
    : practiceCity;

  if (!practiceLabel) {
    return (
      <p className="mt-1.5 text-xs text-muted">{application.submittedLabel}</p>
    );
  }

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
      <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
      <span className="truncate">{practiceLabel}</span>
    </p>
  );
}
