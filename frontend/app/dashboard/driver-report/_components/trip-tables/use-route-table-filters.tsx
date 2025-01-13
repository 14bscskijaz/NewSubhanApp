'use client';

import { searchParams } from '@/lib/searchparams';
import { RootState } from '@/lib/store';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';

export function useRouteTableFilters() {
  // Retrieve employees from Redux
  const employees = useSelector<RootState, Employee[]>(allEmployees);

  // Create DRIVER_OPTIONS directly from employees array
  const DRIVER_OPTIONS = employees.map(employee => ({
    value: employee.id.toString(),
    label: `${employee.firstName} ${employee.lastName}`,
  }));

  // Filter for Date
  const [dateFilter, setDateFilter] = useQueryState<string>(
    'date',
    searchParams.date.withOptions({ shallow: false }).withDefault("")
  );

  // Filter for Driver
  const [driverFilter, setDriverFilter] = useQueryState<string>(
    'driver',
    searchParams.driver.withOptions({ shallow: false }).withDefault("")
  );

  // Search Query
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setDriverFilter(null);
    setDateFilter(null);
    setSearchQuery(null);
    setPage(1);
  }, [setDriverFilter, setDateFilter, setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!driverFilter || !!dateFilter || !!searchQuery;
  }, [driverFilter, dateFilter, searchQuery]);

  return {
    driverFilter,
    setDriverFilter,
    dateFilter,
    setDateFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    DRIVER_OPTIONS,
  };
}
