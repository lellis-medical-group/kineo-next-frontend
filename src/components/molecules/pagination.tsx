"use client";

import { Button } from "@/components/atoms/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/atoms/icons";

interface PaginationProps {
  /** Current page number (1-based). */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Callback when page changes. */
  onPageChange: (page: number) => void;
}

/**
 * Pagination controls — previous/next buttons with page indicator.
 * Renders even with a single page so users can see the pagination state.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Always render, but disable buttons if single page
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-4"
    >
      <Button
        variant="outline"
        size="md"
        disabled={!hasPrevious || totalPages <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Précédent
      </Button>

      <span className="text-sm text-muted">
        Page {currentPage} sur {totalPages}
      </span>

      <Button
        variant="outline"
        size="md"
        disabled={!hasNext || totalPages <= 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Suivant
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
}
