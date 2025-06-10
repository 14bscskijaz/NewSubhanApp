"use client";

import { searchParams } from '@/lib/searchparams';
import { Buses, allBuses } from '@/lib/slices/bus-slices';
import { RootState } from '@/lib/store';
import { set } from 'date-fns';
import { parseAsString, useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useSelector } from "react-redux";

export function useTableFilters() {
  const buses = useSelector<RootState, Buses[]>(allBuses);
  
  // const BUS_OPTIONS = buses.map(bus => ({
  //   value: bus.id,
  //   label: bus.busNumber
  // }))
  const BUS_OPTIONS = useMemo(() => {
    return buses.map(bus => ({
      value: `${bus.id}`,
      label: bus.busNumber
    }));
  }, [buses]);


  const [page, setPage] = useQueryState('page', searchParams.page );
  const [pageSize, setPageSize] = useQueryState('pageSize', searchParams.pageSize );
  const [searchQuery, setSearchQuery] = useQueryState('q', searchParams.q.withOptions({ throttleMs: 2_000 }));
  const [dateFilter, setDateFilter] = useQueryState('date', searchParams.date); 
  const [busIdsFilter, setBusIdFilters] = useQueryState('busId', searchParams.busId);  // no need shallow false as data is fetch client side

  const resetFilters = useCallback(() => {
    setPage(1);
    setPageSize(10);
    setSearchQuery(null);
    setBusIdFilters(null);
    setDateFilter(null);
  }, [setPage, setPageSize, setSearchQuery, setBusIdFilters, setDateFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!page || !!pageSize || !!searchQuery || !!busIdsFilter || !!dateFilter;
  }, [page, pageSize, searchQuery, busIdsFilter, dateFilter]);
  
  return {
    isAnyFilterActive,
    resetFilters,
    BUS_OPTIONS,
    setPage,
    setPageSize,
    setSearchQuery,
    setBusIdFilters,
    setDateFilter,
    page,
    pageSize,
    searchQuery,
    busIdsFilter,
    dateFilter
  };
}