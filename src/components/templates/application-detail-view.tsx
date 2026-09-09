import Link from "next/link";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { ApplicationDetail } from "@/components/organisms/application-detail";
import type { ApplicationEntry } from "@/lib/applications";

/** Dedicated application page — back link and the full detail card. */
export function ApplicationDetailView({
  application,
}: {
  application: ApplicationEntry;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Retour à mes candidatures
      </Link>

      <div className="mt-8">
        <ApplicationDetail application={application} />
      </div>
    </div>
  );
}
