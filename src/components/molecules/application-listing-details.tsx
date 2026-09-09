import type { ApplicationListingInfo } from "@/lib/applications";

/** Targeted-listing facts (period, remuneration) and description. */
export function ApplicationListingDetails({
  listing,
}: {
  listing: ApplicationListingInfo;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold text-foreground">L&apos;annonce</h2>

      <dl className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs text-muted">Période</dt>
          <dd className="mt-1.5 text-base font-bold text-foreground">
            {listing.dateRange ?? "Dates non communiquées"}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-xs text-muted">Rémunération</dt>
          <dd className="mt-1.5 text-base font-bold text-foreground">
            {listing.remuneration ?? "Non précisée"}
          </dd>
        </div>
      </dl>

      {listing.description && (
        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted">
          {listing.description}
        </p>
      )}
    </section>
  );
}
