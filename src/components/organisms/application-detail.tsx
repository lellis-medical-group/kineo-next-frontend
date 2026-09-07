import { Avatar } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Card } from "@/components/atoms/card";
import { type ApplicationEntry, STATUS_META } from "@/lib/applications";
import { formatDateTime } from "@/lib/format";

/**
 * Detail panel — everything about the selected application: the targeted
 * listing, the message sent, rejection/withdrawal reasons and the follow-up
 * timeline. Read-only: decision actions live on the practice side
 * (« Mes offres »).
 */
export function ApplicationDetail({
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
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            name={listing.practiceName ?? listing.title}
            className="h-14 w-14 text-lg"
          />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-foreground">
              {listing.title}
            </h2>
            {practiceLabel && (
              <p className="truncate text-sm text-muted">{practiceLabel}</p>
            )}
          </div>
        </div>
        <Badge tone={meta.badgeTone}>{meta.label}</Badge>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <h3 className="text-sm font-bold text-foreground">L'annonce</h3>
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
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <h3 className="text-sm font-bold text-foreground">Votre message</h3>
        {application.message ? (
          <blockquote className="mt-3 whitespace-pre-line rounded-control bg-surface-2 p-4 text-sm leading-relaxed text-muted">
            {application.message}
          </blockquote>
        ) : (
          <p className="mt-3 text-sm italic text-muted">
            Aucun message n'a été envoyé avec cette candidature.
          </p>
        )}
      </div>

      {application.status === "REJECTED" && (
        <div className="mt-5 rounded-control border border-danger/20 bg-danger/10 p-4">
          <h3 className="text-sm font-bold text-danger">Motif du refus</h3>
          <p className="mt-1.5 text-sm text-muted">
            {application.rejectionReason ??
              "Aucun motif n'a été communiqué par le cabinet."}
          </p>
        </div>
      )}

      {application.status === "WITHDRAWN" && (
        <div className="mt-5 rounded-control border border-border bg-surface-2 p-4">
          <h3 className="text-sm font-bold text-foreground">
            Motif du retrait
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            {application.withdrawnReason ??
              "Vous avez retiré cette candidature sans préciser de motif."}
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-border pt-5">
        <h3 className="text-sm font-bold text-foreground">Suivi</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            Envoyée le{" "}
            <strong className="font-bold text-foreground">
              {formatDateTime(application.createdAt)}
            </strong>
          </li>
          {application.viewedAt && (
            <li>
              Consultée par le cabinet le{" "}
              <strong className="font-bold text-foreground">
                {formatDateTime(application.viewedAt)}
              </strong>
            </li>
          )}
          {application.respondedAt && (
            <li>
              Réponse du cabinet le{" "}
              <strong className="font-bold text-foreground">
                {formatDateTime(application.respondedAt)}
              </strong>
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}
