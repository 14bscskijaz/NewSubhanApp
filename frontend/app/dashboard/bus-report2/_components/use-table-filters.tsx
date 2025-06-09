'use client';

import { useQueryState } from 'nuqs';
import { searchParams } from '@/lib/searchparams';
import { useCallback, useMemo } from 'react';

export function useTableFilters() {

  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault('')
  );
  const [busNumberFilter, setBusNumberFilter] = useQueryState(
    'busNumber',
    searchParams.busNumber.withOptions({ shallow: false }).withDefault('')
  );
  const [ownerFilter, setBusOwnerFilter] = useQueryState(
    'busOwner',
    searchParams.busOwner.withOptions({ shallow: false }).withDefault('')
  );
  const [dateFilter, setDateFilter] = useQueryState<string>(
    'date',
    searchParams.date.withOptions({ shallow: false }).withDefault("")
  );
  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );
  
  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setBusNumberFilter(null);
    setBusOwnerFilter(null);
    setDateFilter(null);
    setPage(1);
  }, [setSearchQuery, setBusNumberFilter, setBusOwnerFilter, setDateFilter, setPage]);


  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!busNumberFilter || !!ownerFilter || !!dateFilter;
  }, [searchQuery, busNumberFilter, ownerFilter, dateFilter]);

  return {
    searchQuery,
    setSearchQuery,
    busNumberFilter,
    setBusNumberFilter,
    ownerFilter,
    setBusOwnerFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    // BUS_OPTIONS,
    // ROUTE_OPTIONS,
    // BUS_OWNER_OPTIONS,
    dateFilter,
    setDateFilter
  };
}