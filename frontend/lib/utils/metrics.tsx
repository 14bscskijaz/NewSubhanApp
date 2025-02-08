
import { SavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RouteMetric } from '@/types/trip';
import { Route } from '../slices/route-slices';
import { formatNumber } from './accounting';
import { BusClosingVoucher } from '../slices/bus-closing-voucher';

export const calculateMetricsCity = (
  filteredTrips: SavedTripInformation[],
  routes: Route[],
  isCity: boolean,
  vouchers: BusClosingVoucher[]
): RouteMetric[] => {
  const routeMap = new Map<string, any>();

  // Helper function to normalize city names
  const normalizeCityName = (city: string): string => {
    return city
      .trim() // Remove leading/trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, ''); // Remove all spaces (e.g., "New York" => "newyork")
  };

  filteredTrips.forEach(trip => {
    // 1. Find the route DIRECTLY from trip data (not through voucher)
    const route = routes.find(r => r.id.toString() === trip.routeId?.toString());
    if (!route) return; // Skip if no route found (or handle differently)

    // 2. Normalize city names for grouping
    const sourceCity = normalizeCityName(route.sourceCity);
    const destinationCity = normalizeCityName(route.destinationCity);

    // 3. Create grouping key based on normalized city names when isCity=true
    const routeKey = isCity
      ? `${sourceCity}-${destinationCity}`
      : `${route.sourceAdda}-${route.destinationAdda}`;

    // 4. Initialize map entry if not exists
    if (!routeMap.has(routeKey)) {
      routeMap.set(routeKey, {
        routeKey,
        sourceCity: route.sourceCity, // Keep original city name for display
        destinationCity: route.destinationCity, // Keep original city name for display
        sourceAdda: route.sourceAdda,
        destinationAdda: route.destinationAdda,
        totalTrips: 0,
        totalPassengers: 0,
        totalRevenue: 0,
        freePassengers: 0,
        halfPassengers: 0,
        fullPassengers: 0,
        routeIds: new Set<string>(),
        uniqueVoucherIds: new Set<string>(),
      });
    }

    // 5. Update metrics
    const data = routeMap.get(routeKey);
    data.totalTrips += 1;
    data.totalPassengers += Number(trip.passengerCount) || 0;
    data.totalRevenue += Number(trip.revenue) || 0;
    data.freePassengers += Number(trip.freeTicketCount) || 0;
    data.halfPassengers += Number(trip.halfTicketCount) || 0;
    data.fullPassengers += Number(trip.fullTicketCount) || 0;
    data.routeIds.add(route.id.toString());
    
    // 6. Track vouchers if needed
    if (trip.routeClosingVoucherId) {
      data.uniqueVoucherIds.add(trip.routeClosingVoucherId.toString());
    }
  });

  // 7. Convert map to result format
  return Array.from(routeMap.values()).map(data => ({
    ...data,
    totalTrips: data.uniqueVoucherIds.size,
    totalPassengers: data.totalPassengers,
    totalRevenue: Math.floor(data.totalRevenue),
    freePassengers: data.freePassengers,
    halfPassengers: data.halfPassengers,
    fullPassengers: data.fullPassengers,
    averagePassengers: data.uniqueVoucherIds.size > 0
      ? Math.floor(data.totalPassengers / data.uniqueVoucherIds.size)
      : 0,
    routeCount: data.routeIds.size,
    routeIds: Array.from(data.routeIds),
    tripsCount: data.uniqueVoucherIds.size,
    voucherIds: Array.from(data.uniqueVoucherIds),
  }));
};

export const calculateMetricsStation = (
  filteredTrips: SavedTripInformation[],
  routes: Route[]
): RouteMetric[] => {
  const routeMap = new Map<
    string,
    {
      routeKey: string;
      sourceCity: string;
      destinationCity: string;
      sourceAdda: string;
      destinationAdda: string;
      totalTrips: number;
      totalPassengers: number;
      totalRevenue: number;
      freePassengers: number;
      halfPassengers: number;
      fullPassengers: number;
      routeIds: Set<string>;
    }
  >();

  filteredTrips.forEach(trip => {
    const route = routes.find(r => r.id.toString() === trip.routeId?.toString());
    if (!route) return;

    // Corrected: Use sourceAdda and destinationAdda for station-based grouping
    const routeKey = `${route.sourceAdda}-${route.destinationAdda}`;

    if (!routeMap.has(routeKey)) {
      routeMap.set(routeKey, {
        routeKey,
        sourceCity: route.sourceCity,
        destinationCity: route.destinationCity,
        sourceAdda: route.sourceAdda,
        destinationAdda: route.destinationAdda,
        totalTrips: 0,
        totalPassengers: 0,
        totalRevenue: 0,
        freePassengers: 0,
        halfPassengers: 0,
        fullPassengers: 0,
        routeIds: new Set<string>(),
      });
    }
    const data = routeMap.get(routeKey)!;

    data.totalTrips += 1;
    data.routeIds.add(trip.routeId?.toString() || '');
    data.totalPassengers += Number(trip.passengerCount) || 0;
    data.totalRevenue += Number(trip.revenue) || 0;
    data.freePassengers += Number(trip.freeTicketCount) || 0;
    data.halfPassengers += Number(trip.halfTicketCount) || 0;
    data.fullPassengers += Number(trip.fullTicketCount) || 0;
  });

  return Array.from(routeMap.values()).map(data => ({
    ...data,
    totalTrips: data.totalTrips,
    totalPassengers: data.totalPassengers,
    totalRevenue: Math.floor(data.totalRevenue),
    freePassengers: data.freePassengers,
    halfPassengers: data.halfPassengers,
    fullPassengers: data.fullPassengers,
    averagePassengers: data.totalTrips > 0
      ? Math.floor(data.totalPassengers / data.totalTrips)
      : 0,
    routeCount: data.routeIds.size,
    routeIds: Array.from(data.routeIds),
    tripsCount: data.totalTrips,
    voucherIds: [],
  }));
};