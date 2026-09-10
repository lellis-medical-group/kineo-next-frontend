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
    <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[13px] text-muted sm:text-sm">
      <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
      <span className="min-w-0 flex-1 truncate">{practiceLabel}</span>
    </p>
  );
}
