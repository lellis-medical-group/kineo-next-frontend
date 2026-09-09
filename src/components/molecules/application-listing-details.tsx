import { CalendarIcon, PercentIcon } from "@/components/atoms/icons";
import type { ApplicationListingInfo } from "@/lib/applications";

/** Targeted-listing details: period, remuneration and description. */
export function ApplicationListingDetails({
  listing,
}: {
  listing: ApplicationListingInfo;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold text-foreground">L&apos;annonce</h2>
      <dl className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
            Période
          </dt>
          <dd className="mt-1 text-sm font-bold text-foreground">
            {listing.dateRange ?? "Dates non communiquées"}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <PercentIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
            Rémunération
          </dt>
          <dd className="mt-1 text-sm font-bold text-foreground">
            {listing.remuneration ?? "Non précisée"}
          </dd>
        </div>
      </dl>
      {listing.description && (
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
          {listing.description}
        </p>
      )}
    </section>
  );
}
