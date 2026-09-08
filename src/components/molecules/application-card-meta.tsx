import type { ApplicationEntry } from "@/lib/applications";

/** Meta line of an application card: submission time, practice, city. */
export function ApplicationCardMeta({
  application,
}: {
  application: ApplicationEntry;
}) {
  const { practiceName, practiceCity } = application.listing;
  const parts = [application.submittedLabel, practiceName, practiceCity].filter(
    (part): part is string => Boolean(part),
  );
  return (
    <p className="mt-1 truncate text-xs text-muted">{parts.join(" · ")}</p>
  );
}
