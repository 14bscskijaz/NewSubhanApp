'use client';

import { searchParams } from '@/lib/searchparams';
import { Buses, allBuses } from '@/lib/slices/bus-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

// export const TRIP_OPTIONS = [
//   { value: 'passengerCount', label: 'Passenger Count' },
//   { value: 'fullTicketCount', label: 'Full Ticket Count' },
//   { value: 'halfTicketCount', label: 'Half Ticket Count' },
//   { value: 'freeTicketCount', label: 'Free Ticket Count' }
// ];

export function useRouteTableFilters() {
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const routes = useSelector<RootState, Route[]>(allRoutes);

  // Create BUS_OPTIONS directly from buses array
  const BUS_OPTIONS = buses.map(bus => ({
    value: bus.busNumber,
    label: `${bus.busNumber}`
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

  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault('')
  );

  const [busNumberFilter, setBusNumberFilter] = useQueryState(
    'busNumber',
    searchParams.busNumber.withOptions({ shallow: false }).withDefault('')
  );

  const [routeFilter, setRouteFilter] = useQueryState(
    'route',
    searchParams.route.withOptions({ shallow: false }).withDefault('')
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
    setRouteFilter(null);
    setDateFilter(null);
    setPage(1);
  }, [setSearchQuery, setBusNumberFilter, setRouteFilter, setDateFilter, setPage]);


  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!busNumberFilter || !!routeFilter || !!dateFilter;
  }, [searchQuery, busNumberFilter, routeFilter, dateFilter]);


  return {
    searchQuery,
    setSearchQuery,
    busNumberFilter,
    setBusNumberFilter,
    routeFilter,
    setRouteFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    BUS_OPTIONS,
    ROUTE_OPTIONS,
    dateFilter,
    setDateFilter
  };
}
