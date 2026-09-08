import { Card } from "@/components/atoms/card";
import { ApplicationDecisionNote } from "@/components/molecules/application-decision-note";
import { ApplicationDetailHeader } from "@/components/molecules/application-detail-header";
import { ApplicationListingDetails } from "@/components/molecules/application-listing-details";
import { ApplicationMessage } from "@/components/molecules/application-message";
import { ApplicationTimeline } from "@/components/molecules/application-timeline";
import type { ApplicationEntry } from "@/lib/applications";

/** Section wrapper with the top divider used across the detail card. */
function DetailSection({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 border-t border-border pt-6">{children}</div>;
}

/**
 * Full detail of one application on its dedicated page: targeted listing,
 * message, rejection/withdrawal reasons and timeline. Read-only — practice
 * actions live on « Mes offres ».
 */
export function ApplicationDetail({
  application,
}: {
  application: ApplicationEntry;
}) {
  return (
    <Card className="p-6 sm:p-8">
      <ApplicationDetailHeader application={application} />

      <DetailSection>
        <ApplicationListingDetails listing={application.listing} />
      </DetailSection>

      <DetailSection>
        <ApplicationMessage message={application.message} />
      </DetailSection>

      {application.status === "REJECTED" ||
      application.status === "WITHDRAWN" ? (
        <DetailSection>
          <ApplicationDecisionNote application={application} />
        </DetailSection>
      ) : null}

      <DetailSection>
        <ApplicationTimeline application={application} />
      </DetailSection>
    </Card>
  );
}
