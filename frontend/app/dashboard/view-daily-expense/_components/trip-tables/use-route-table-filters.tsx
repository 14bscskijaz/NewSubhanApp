'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const TRIP_OPTIONS = [
  { value: 'passengerCount', label: 'Passenger Count' },
  { value: 'fullTicketCount', label: 'Full Ticket Count' },
  { value: 'halfTicketCount', label: 'Half Ticket Count' },
  { value: 'freeTicketCount', label: 'Free Ticket Count' }
];;

export function useRouteTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [sourceFilter, setSourceFilter] = useQueryState(
    'source',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setSourceFilter(null);

    setPage(1);
  }, [setSearchQuery, setSourceFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!sourceFilter;
  }, [searchQuery, sourceFilter]);

  return {
    searchQuery,
    setSearchQuery,
    sourceFilter,
    setSourceFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
