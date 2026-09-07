import { Card } from "@/components/atoms/card";
import { ApplicationCard } from "@/components/molecules/application-card";
import type { ApplicationEntry } from "@/lib/applications";

interface ApplicationsListProps {
  applications: ApplicationEntry[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

/** List column — one card per application, most recent first. */
export function ApplicationsList({
  applications,
  selectedId,
  onSelect,
}: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <Card className="p-6 text-sm text-muted">
        Aucune candidature dans ce statut.
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {applications.map((application) => (
        <li key={application.id}>
          <ApplicationCard
            application={application}
            selected={application.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
