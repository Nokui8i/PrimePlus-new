import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const halfMaxPages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxPages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
          currentPage === 1
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            currentPage === page
              ? 'z-10 bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
          currentPage === totalPages
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="sr-only">Next</span>
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination; 