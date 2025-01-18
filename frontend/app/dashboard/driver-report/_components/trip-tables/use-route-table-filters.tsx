'use client';

import { searchParams } from '@/lib/searchparams';
import { RootState } from '@/lib/store';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';
import { Buses as BusLocal, allBuses } from '@/lib/slices/bus-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';

export function useRouteTableFilters() {
  // Retrieve employees and buses from Redux
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const buses = useSelector<RootState, BusLocal[]>(allBuses);
  const routes = useSelector<RootState, Route[]>(allRoutes);

  // Create DRIVER_OPTIONS from employees array
  const DRIVER_OPTIONS = employees.map(employee => ({
    value: employee.id.toString(),
    label: `${employee.firstName} ${employee.lastName}`,
  }));

  // Create BUS_BRAND_OPTIONS directly from buses array
  const BUS_BRAND_OPTIONS = Array.from(
    new Set(buses.map(bus => bus.busBrand))
  ).map(brand => ({
    value: brand,
    label: brand,
  }));

 // Ensure ROUTE_OPTIONS are unique using a Set
 const ROUTE_OPTIONS = useMemo(() => {
  const uniqueRoutes = new Set<string>();
  return routes.reduce((acc, route) => {
    const routeKey = `${route.sourceCity.toString().trim()}-${route.destinationCity.toString().trim()}`;
    if (!uniqueRoutes.has(routeKey)) {
      uniqueRoutes.add(routeKey);
      acc.push({
        value: routeKey,
        label: `${route.sourceCity.toString().trim()} to ${route.destinationCity}`
      });
    }
    return acc;
  }, [] as { value: string; label: string }[]);
}, [routes]);

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

  // Filter for Bus Brand
  const [busBrandFilter, setBusBrandFilter] = useQueryState<string>(
    'busBrand',
    searchParams.busBrand.withOptions({ shallow: false }).withDefault("")
  );

  // Filter for Route
  const [routeFilter, setRouteFilter] = useQueryState<string>(
    'route',
    searchParams.route.withOptions({ shallow: false }).withDefault("")
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
    setBusBrandFilter(null);
    setRouteFilter(null);
    setSearchQuery(null);
    setPage(1);
  }, [setDriverFilter, setDateFilter, setBusBrandFilter, setRouteFilter, setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!driverFilter || !!dateFilter || !!busBrandFilter || !!routeFilter || !!searchQuery;
  }, [driverFilter, dateFilter, busBrandFilter, routeFilter, searchQuery]);

  return {
    driverFilter,
    setDriverFilter,
    dateFilter,
    setDateFilter,
    busBrandFilter,
    setBusBrandFilter,
    routeFilter,
    setRouteFilter,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    DRIVER_OPTIONS,
    BUS_BRAND_OPTIONS,
    ROUTE_OPTIONS,
  };
}
