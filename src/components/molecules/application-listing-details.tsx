import type { ApplicationListingInfo } from "@/lib/applications";

/** Targeted-listing details: period, remuneration and description. */
export function ApplicationListingDetails({
  listing,
}: {
  listing: ApplicationListingInfo;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold text-foreground">L'annonce</h2>
      <dl className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted">Période</dt>
          <dd className="mt-0.5 text-sm font-bold text-foreground">
            {listing.dateRange ?? "Dates non communiquées"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Rémunération</dt>
          <dd className="mt-0.5 text-sm font-bold text-foreground">
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
