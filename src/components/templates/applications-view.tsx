"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { FileTextIcon } from "@/components/atoms/icons";
import { FilterChips } from "@/components/molecules/filter-chips";
import { ApplicationsList } from "@/components/organisms/applications-list";
import {
  APPLICATION_FILTERS,
  type ApplicationsData,
  type ApplicationsFilter,
} from "@/lib/applications";

/**
 * Applications tracking page — status filters and the airy list of sent
 * applications; each card links to its dedicated detail page.
 */
export function ApplicationsView({ data }: { data: ApplicationsData }) {
  const [filter, setFilter] = useState<ApplicationsFilter>("ALL");

  const filtered = useMemo(
    () =>
      filter === "ALL"
        ? data.applications
        : data.applications.filter((a) => a.status === filter),
    [data.applications, filter],
  );

  const counts = useMemo(() => {
    const map = new Map<ApplicationsFilter, number>([
      ["ALL", data.applications.length],
    ]);
    for (const entry of data.applications) {
      map.set(entry.status, (map.get(entry.status) ?? 0) + 1);
    }
    return map;
  }, [data.applications]);

  if (data.total === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <ApplicationsHeader total={data.total} />
        <Card className="mt-8 flex flex-col items-center p-8 text-center sm:p-10">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <FileTextIcon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Aucune candidature pour l'instant
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Parcourez les annonces ouvertes et candidatez en un clic avec un
            message personnalisé.
          </p>
          <Button href="/listings" className="mt-6">
            Parcourir les annonces
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <ApplicationsHeader total={data.total} />

      <FilterChips
        ariaLabel="Filtrer les candidatures par statut"
        className="mt-6"
        options={APPLICATION_FILTERS.map((option) => ({
          ...option,
          count: counts.get(option.id) ?? 0,
        }))}
        value={filter}
        onChange={setFilter}
      />

      <div className="mt-8">
        <ApplicationsList applications={filtered} />
      </div>
    </div>
  );
}

function ApplicationsHeader({ total }: { total: number }) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Mes candidatures
        </h1>
        <Badge>{total} total</Badge>
      </div>
      <p className="mt-1.5 text-sm text-muted">
        Suivez l'état de vos candidatures envoyées aux cabinets.
      </p>
    </header>
  );
}
