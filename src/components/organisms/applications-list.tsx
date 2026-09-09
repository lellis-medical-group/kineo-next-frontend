import { Card } from "@/components/atoms/card";
import { ApplicationCard } from "@/components/molecules/application-card";
import type { ApplicationEntry } from "@/lib/applications";

/** Application list — one airy card per application, most recent first. */
export function ApplicationsList({
  applications,
}: {
  applications: ApplicationEntry[];
}) {
  if (applications.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted">
        Aucune candidature dans ce statut.
      </Card>
    );
  }

  return (
    <ul className="space-y-5">
      {applications.map((application) => (
        <li key={application.id}>
          <ApplicationCard application={application} />
        </li>
      ))}
    </ul>
  );
}
