import type { ComponentType, SVGProps } from "react";
import type { BadgeTone } from "@/components/atoms/badge";
import {
  AlertIcon,
  ArrowLeftIcon,
  BellIcon,
  CheckIcon,
  StarIcon,
} from "@/components/atoms/icons";
import { type ApplicationEntry, STATUS_META } from "@/lib/applications";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/types/api";

/** Icon per status — the outcome at a glance. */
const STATUS_ICONS: Record<
  ApplicationStatus,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  PENDING: BellIcon,
  SHORTLISTED: StarIcon,
  ACCEPTED: CheckIcon,
  REJECTED: AlertIcon,
  WITHDRAWN: ArrowLeftIcon,
};

/** Banner headline per status — more explicit than the chip labels. */
const STATUS_HEADLINES: Record<ApplicationStatus, string> = {
  PENDING: "En attente de réponse",
  SHORTLISTED: "Présélectionnée",
  ACCEPTED: "Candidature acceptée",
  REJECTED: "Candidature rejetée",
  WITHDRAWN: "Candidature retirée",
};

/** Tone band classes per badge tone — same tints as the old decision note. */
const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface-2 text-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
  info: "border-info/20 bg-info/10 text-info",
};

/** Key dates or decision reason, per status — the banner's summary line. */
function buildSummary(application: ApplicationEntry): string {
  const summaries: Record<ApplicationStatus, string> = {
    PENDING: application.viewedAt
      ? `Consultée par le cabinet le ${formatDateTime(application.viewedAt)} — réponse en attente.`
      : `Envoyée le ${formatDateTime(application.createdAt)} — pas encore consultée par le cabinet.`,
    SHORTLISTED: application.viewedAt
      ? `Consultée le ${formatDateTime(application.viewedAt)} — votre profil a été retenu par le cabinet.`
      : "Votre profil a été retenu par le cabinet.",
    ACCEPTED: application.respondedAt
      ? `Réponse du cabinet reçue le ${formatDateTime(application.respondedAt)}.`
      : "Le cabinet a accepté votre candidature.",
    REJECTED:
      application.rejectionReason ??
      "Aucun motif n'a été communiqué par le cabinet.",
    WITHDRAWN:
      application.withdrawnReason ?? "Aucun motif de retrait n'a été précisé.",
  };

  return summaries[application.status];
}

/**
 * Outcome banner — the first-glance answer of the detail page: status
 * headline, key dates or decision reason, tinted by the status tone.
 * Replaces both the header badge and the standalone decision note. The icon
 * is vertically centered on the text block (both-axis alignment).
 */
export function ApplicationStatusBanner({
  application,
  className,
}: {
  application: ApplicationEntry;
  className?: string;
}) {
  const meta = STATUS_META[application.status];
  const Icon = STATUS_ICONS[application.status];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-control border p-4 sm:p-5",
        TONE_CLASSES[meta.badgeTone],
        className,
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-bold">
          {STATUS_HEADLINES[application.status]}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {buildSummary(application)}
        </p>
      </div>
    </div>
  );
}
