import { CalendarIcon, PercentIcon } from "@/components/atoms/icons";
import type { ApplicationListingInfo } from "@/lib/applications";

/**
 * Targeted-listing facts — the two decision-driving facts (period,
 * remuneration) as icon-chip blocks: the chip is vertically centered on the
 * text block (alignment on both axes by construction) and the label and
 * value share the same left edge. The listing description flows as prose
 * underneath.
 */
export function ApplicationListingDetails({
  listing,
}: {
  listing: ApplicationListingInfo;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold text-foreground">L&apos;annonce</h2>

      <dl className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"
          >
            <CalendarIcon className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs text-muted">Période</dt>
            <dd className="mt-1.5 text-base font-bold text-foreground">
              {listing.dateRange ?? "Dates non communiquées"}
            </dd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"
          >
            <PercentIcon className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs text-muted">Rémunération</dt>
            <dd className="mt-1.5 text-base font-bold text-foreground">
              {listing.remuneration ?? "Non précisée"}
            </dd>
          </div>
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
