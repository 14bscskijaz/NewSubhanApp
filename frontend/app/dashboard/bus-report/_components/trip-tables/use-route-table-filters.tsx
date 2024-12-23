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
  
  const BUS_OWNER_OPTIONS = useMemo(() => {
    const uniqueOwners = new Set<string>();
    return buses.reduce((acc, bus) => {
      if (!uniqueOwners.has(bus.busOwner)) {
        uniqueOwners.add(bus.busOwner);
        acc.push({
          value: bus.busOwner,
          label: `${bus.busOwner}`,
        });
      }
      return acc;
    }, [] as { value: string; label: string }[]);
  }, [buses]);

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
    BUS_OPTIONS,
    ROUTE_OPTIONS,
    BUS_OWNER_OPTIONS,
    dateFilter,
    setDateFilter
  };
}
