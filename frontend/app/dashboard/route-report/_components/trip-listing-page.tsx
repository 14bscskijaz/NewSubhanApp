'use client';

import { getAllBuses } from '@/app/actions/bus.action';
import { getAllTicketPrices } from '@/app/actions/pricing.action';
import { getAllRoutes } from '@/app/actions/route.action';
import { getAllTrips } from '@/app/actions/trip.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { setBus } from '@/lib/slices/bus-slices';
import { setTicketRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices';
import { SavedTripInformation, allSavedsavedTripsInformation, setSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RootState } from '@/lib/store';
import { normalizeDate, parseDateRange } from '@/lib/utils/date';
import { calculateMetricsCity, calculateMetricsStation } from '@/lib/utils/metrics';
import { printExpenses } from '@/lib/utils/print';
import { RouteMetric, SearchFilters } from '@/types/trip';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripTable from './trip-tables';
import { allBusClosingVouchers, BusClosingVoucher, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';

export default function TripListingPage() {
  const savedTripInformation = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [isCityTab, setIsCityTab] = useState(true);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  // Memoize search parameters
  const searchFilters = useMemo<SearchFilters>(() => ({
    search: searchParams.get('q') || '',
    busNumber: searchParams.get('busNumber') || '',
    dateRange: searchParams.get('date') || '',
    route: searchParams.get('route') ? searchParams.get('route')!.split(',') : "",
    limit: Number(searchParams.get('limit')) || 10,
    page: Number(searchParams.get('page')) || 1,
  }), [searchParams]);
  

  // Memoize date range
  const dateRange = useMemo(() =>
    parseDateRange(searchFilters.dateRange),
    [searchFilters.dateRange]
  );

  // Memoize filtered trips
  const filteredTrips = useMemo(() => {
    return savedTripInformation.filter(trip => {
      if (!trip.date) return true;
      const tripDate = normalizeDate(trip.date);

      if (dateRange.start && dateRange.end) {
        return tripDate >= dateRange.start && tripDate < dateRange.end;
      } else if (dateRange.start) {
        return tripDate >= dateRange.start;
      } else if (dateRange.end) {
        return tripDate < dateRange.end;
      }
      return true;
    });
  }, [savedTripInformation, dateRange]);

  // Memoize route metrics
  const routeMetrics = useMemo(() =>
    isCityTab ? calculateMetricsCity(filteredTrips, routes, isCityTab, vouchers) : calculateMetricsStation(filteredTrips, routes),
    [filteredTrips, routes, isCityTab]
  );

  // Memoize filtered vouchers
  const filteredVouchers = useMemo(() => {
    return routeMetrics.filter(voucher => {
      const matchesSearch = !searchFilters.search || [
        'averagePassengers',
        'freePassengers',
        'fullPassengers',
        'totalPassengers',
        'totalRevenue',
        'totalTrips',
        'halfPassengers',
      ].some(key =>
        voucher[key as keyof RouteMetric]?.toString().toLowerCase().includes(searchFilters.search.toLowerCase())
      );
  
      const routeData = routes.find(route =>
        route.id.toString().trim() === voucher.routeIds[0]?.toString().trim()
      );
  
      const routeKey = routeData
        ? `${routeData.sourceCity.trim()}-${routeData.destinationCity.trim()}`
        : '';
  
      const matchesRouteFilter =
        !searchFilters.route || (Array.isArray(searchFilters.route) && searchFilters.route.length === 0) ||
        (Array.isArray(searchFilters.route) && searchFilters.route.some(route => route.toLowerCase() === routeKey.toLowerCase()));
  
      return matchesSearch && matchesRouteFilter;
    });
  }, [routeMetrics, searchFilters.search, searchFilters.route, routes]);
  

  // Data fetching
  const fetchData = useCallback(async () => {
    try {
      const [trips, routesData, allVouchers, busesData, tickets] = await Promise.all([
        getAllTrips(),
        getAllRoutes(),
        getAllBusClosingVouchers(),
        getAllBuses(),
        getAllTicketPrices()
      ]);

      dispatch(setSavedTripInformation(trips));
      dispatch(setRoute(routesData));
      dispatch(setBusClosingVoucher(allVouchers));
      dispatch(setBus(busesData));
      dispatch(setTicketRaw(tickets));
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      });
    }
  }, [dispatch, toast]);

  useEffect(() => {
    fetchData();
    setPage(searchFilters.page);
    setPageLimit(searchFilters.limit);
  }, [fetchData, searchFilters.page, searchFilters.limit]);

  const totalRevenue = useMemo(() =>
    filteredVouchers.reduce((sum, item) => sum + (item.totalRevenue || 0), 0),
    [filteredVouchers]
  );

  const paginatedTrips = useMemo(() => {
    const startIndex = (page - 1) * pageLimit;
    return filteredVouchers.slice(startIndex, startIndex + pageLimit);
  }, [filteredVouchers, page, pageLimit]);

  const handlePrint = useCallback(() => {
    printExpenses(filteredVouchers, routes, isCityTab, searchFilters);
  }, [filteredVouchers, routes, isCityTab, searchFilters]);


  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Route Report (${filteredVouchers.length})`}
            description=""
          />
        </div>
        <Separator />
        <TripTable
          data={paginatedTrips}
          totalData={filteredVouchers.length}
          totalRevenue={totalRevenue}
          printExpenses={handlePrint}
          isCityTab={isCityTab}
          setIsCityTab={setIsCityTab}
        />
      </div>
    </PageContainer>
  );
}

