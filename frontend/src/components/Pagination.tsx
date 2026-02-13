import React from 'react';

interface PaginationProps {
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, size, total, onPageChange }) => {
  if (total <= size) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(total / size));
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    onPageChange(nextPage);
  };

  return (
    <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={!canPrevious}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Previous
      </button>
      <p className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={!canNext}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
