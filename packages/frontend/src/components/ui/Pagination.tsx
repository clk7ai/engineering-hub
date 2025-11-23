import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  baseUrl?: string; // For URL-based pagination
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    // Always show first page
    pages.push(1);

    // Show ellipsis or pages before current
    if (showEllipsisStart) {
      pages.push('...');
      pages.push(currentPage - 1);
    } else {
      for (let i = 2; i < currentPage; i++) {
        pages.push(i);
      }
    }

    // Show current page
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    // Show ellipsis or pages after current
    if (showEllipsisEnd) {
      pages.push(currentPage + 1);
      pages.push('...');
    } else {
      for (let i = currentPage + 1; i < totalPages; i++) {
        pages.push(i);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const renderPageButton = (page: number | string, index: number) => {
    const isEllipsis = page === '...';
    const isActive = page === currentPage;

    const baseClasses =
      'px-4 py-2 text-sm font-medium transition-colors rounded-lg';
    const activeClasses =
      'bg-primary-500 text-white hover:bg-primary-600';
    const inactiveClasses =
      'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300';
    const ellipsisClasses = 'bg-transparent text-gray-500 cursor-default';

    const className = `${
      baseClasses
    } ${
      isEllipsis
        ? ellipsisClasses
        : isActive
        ? activeClasses
        : inactiveClasses
    }`;

    if (isEllipsis) {
      return (
        <span key={`ellipsis-${index}`} className={className}>
          {page}
        </span>
      );
    }

    const pageNum = page as number;

    if (baseUrl) {
      return (
        <Link
          key={`page-${pageNum}`}
          href={`${baseUrl}?page=${pageNum}`}
          className={className}
        >
          {page}
        </Link>
      );
    }

    return (
      <button
        key={`page-${pageNum}`}
        onClick={() => onPageChange(pageNum)}
        className={className}
        disabled={isActive}
      >
        {page}
      </button>
    );
  };

  const PreviousButton = () => {
    const disabled = currentPage === 1;
    const className = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
    }`;

    if (baseUrl && !disabled) {
      return (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className={className}
        >
          Previous
        </Link>
      );
    }

    return (
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled}
        className={className}
      >
        Previous
      </button>
    );
  };

  const NextButton = () => {
    const disabled = currentPage === totalPages;
    const className = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
    }`;

    if (baseUrl && !disabled) {
      return (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className={className}
        >
          Next
        </Link>
      );
    }

    return (
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled}
        className={className}
      >
        Next
      </button>
    );
  };

  return (
    <nav
      className="flex items-center justify-center space-x-2 my-8"
      aria-label="Pagination"
    >
      <PreviousButton />
      {getPageNumbers().map((page, index) => renderPageButton(page, index))}
      <NextButton />
    </nav>
  );
};

export default Pagination;
