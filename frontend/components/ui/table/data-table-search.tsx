'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Options } from 'nuqs';
import { useTransition } from 'react';

interface DataTableSearchProps {
  searchKey: string;
  ariaLabel?: string;
  placeholder?: string;
  searchQuery: string;
  setSearchQuery: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setPage: (
    value: number | ((old: number) => number | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
}

export function DataTableSearch({
  searchQuery,
  setSearchQuery,
  setPage,
  ariaLabel,
  placeholder = 'Search ...'
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setSearchQuery(value, { startTransition });
    setPage(1); // Reset page to 1 when search changes
  };

  return (
    <Input
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={searchQuery ?? ''}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn(
        'bg-gradient-border w-full placeholder:text-gray-300 md:w-[24rem]',
        isLoading && 'animate-pulse'
      )}
    />
  );
}
