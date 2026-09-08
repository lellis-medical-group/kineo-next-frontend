"use client";

import { Badge } from "@/components/atoms/badge";
import { FileTextIcon } from "@/components/atoms/icons";
import { FilterChips } from "@/components/molecules/filter-chips";
import { Pagination } from "@/components/molecules/pagination";
import { ApplicationsList } from "@/components/organisms/applications-list";
import { EmptyState } from "@/components/organisms/empty-state";
import {
  APPLICATION_FILTERS,
  type ApplicationsData,
  type ApplicationsFilter,
} from "@/lib/applications";

interface ApplicationsViewProps {
  data: ApplicationsData;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: ApplicationsFilter) => void;
  currentFilter: ApplicationsFilter;
}

/**
 * Applications tracking page — status filters, list and pagination. Tab
 * counters come exclusively from `data.counts` (backend-computed over the
 * whole collection), so they never move when the filter or page changes.
 */
export function ApplicationsView({
  data,
  onPageChange,
  onFilterChange,
  currentFilter,
}: ApplicationsViewProps) {
  const filter = currentFilter;

  // Backend filters, so applications are already scoped.
  const filtered = data.applications;

  if (data.counts.total === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <ApplicationsHeader allCount={data.counts.total} />
        <EmptyState
          icon={<FileTextIcon className="h-8 w-8 text-primary" />}
          title="Aucune candidature pour l'instant"
          description="Parcourez les annonces ouvertes et candidatez en un clic avec un message personnalisé."
          actionLabel="Parcourir les annonces"
          actionHref="/listings"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <ApplicationsHeader allCount={data.counts.total} />

      <FilterChips
        ariaLabel="Filtrer les candidatures par statut"
        className="mt-6"
        options={APPLICATION_FILTERS.map((option) => ({
          ...option,
          count:
            option.id === "ALL" ? data.counts.total : data.counts[option.id],
        }))}
        value={filter}
        onChange={onFilterChange}
      />

      <div className="mt-8">
        <ApplicationsList applications={filtered} />
      </div>

      <Pagination
        currentPage={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function ApplicationsHeader({ allCount }: { allCount: number }) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Mes candidatures
        </h1>
        <Badge>{allCount} total</Badge>
      </div>
      <p className="mt-1.5 text-sm text-muted">
        Suivez l&apos;état de vos candidatures envoyées aux cabinets.
      </p>
    </header>
  );
}
