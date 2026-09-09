import { Card } from "@/components/atoms/card";
import { ApplicationDetailHeader } from "@/components/molecules/application-detail-header";
import { ApplicationListingDetails } from "@/components/molecules/application-listing-details";
import { ApplicationMessage } from "@/components/molecules/application-message";
import { ApplicationStatusBanner } from "@/components/molecules/application-status-banner";
import { ApplicationTimeline } from "@/components/molecules/application-timeline";
import type { ApplicationEntry } from "@/lib/applications";

/** Section wrapper with the top divider used across the detail card. */
function DetailSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 border-t border-border pt-8 sm:mt-10 sm:pt-10">
      {children}
    </div>
  );
}

/** Full application detail — read-only (practice actions live on "Mes offres"). */
export function ApplicationDetail({
  application,
}: {
  application: ApplicationEntry;
}) {
  return (
    <Card className="p-6 sm:p-8">
      <ApplicationDetailHeader application={application} />

      <ApplicationStatusBanner application={application} className="mt-6" />

      <DetailSection>
        <ApplicationListingDetails listing={application.listing} />
      </DetailSection>

      <DetailSection>
        <ApplicationMessage message={application.message} />
      </DetailSection>

      <DetailSection>
        <ApplicationTimeline application={application} />
      </DetailSection>
    </Card>
  );
}
