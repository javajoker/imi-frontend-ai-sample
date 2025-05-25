import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { clsx } from "clsx";
import { usePagination } from "../../hooks/usePagination";
import Button from "../atoms/Button";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showInfo?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showInfo = true,
  className,
}) => {
  const {
    pages,
    canGoNext,
    canGoPrevious,
    goToPage,
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
    totalPages,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems,
    itemsPerPage,
    initialPage: currentPage,
    siblingCount,
  });

  // Sync external page changes
  React.useEffect(() => {
    if (currentPage !== undefined) {
      goToPage(currentPage);
    }
  }, [currentPage, goToPage]);

  // Don't render if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      goToPage(page);
      onPageChange(page);
    }
  };

  const handleNext = () => {
    goToNext();
    onPageChange(currentPage + 1);
  };

  const handlePrevious = () => {
    goToPrevious();
    onPageChange(currentPage - 1);
  };

  const handleFirst = () => {
    goToFirst();
    onPageChange(1);
  };

  const handleLast = () => {
    goToLast();
    onPageChange(totalPages);
  };

  return (
    <div className={clsx("flex flex-col items-center space-y-4", className)}>
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{endIndex + 1}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page */}
        {showFirstLast && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFirst}
            disabled={!canGoPrevious}
            className="px-2"
          >
            <ChevronsLeft className="w-4 h-4" />
            <span className="sr-only">First page</span>
          </Button>
        )}

        {/* Previous Page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className="px-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500"
                >
                  {page}
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isActive ? "primary" : "ghost"}
                size="sm"
                onClick={() => handlePageClick(pageNumber)}
                className={clsx(
                  "min-w-[2.5rem]",
                  isActive && "pointer-events-none"
                )}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={!canGoNext}
          className="px-2"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="sr-only">Next page</span>
        </Button>

        {/* Last Page */}
        {showFirstLast && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLast}
            disabled={!canGoNext}
            className="px-2"
          >
            <ChevronsRight className="w-4 h-4" />
            <span className="sr-only">Last page</span>
          </Button>
        )}
      </div>
    </div>
  );
};

// Simple pagination component with minimal controls
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={clsx("flex items-center justify-between", className)}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Previous
      </Button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
