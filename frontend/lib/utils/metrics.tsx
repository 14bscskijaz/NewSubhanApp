
import { SavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RouteMetric } from '@/types/trip';
import { Route } from '../slices/route-slices';
import { formatNumber } from './accounting';

export const calculateMetricsCity = (
    filteredTrips: SavedTripInformation[],
    routes: Route[],
    isCity: boolean
): RouteMetric[] => {
    const routeMap = new Map<string, any>();

    filteredTrips.forEach(trip => {
        const route = routes.find(r => r.id.toString() === trip.routeId?.toString());
        if (!route) return;

        const routeKey = isCity
            ? `${route.sourceCity}-${route.destinationCity}`
            : route.id.toString();

        if (!routeMap.has(routeKey)) {
            routeMap.set(routeKey, {
                routeKey,
                sourceCity: route.sourceCity,
                destinationCity: route.destinationCity,
                sourceAdda: route.sourceAdda,
                destinationAdda: route.destinationAdda,
                routeId: route.id,
                totalTrips: 0,
                totalPassengers: 0,
                totalRevenue: 0,
                freePassengers: 0,
                halfPassengers: 0,
                fullPassengers: 0,
                routeIds: new Set(),
                uniqueVoucherIds: new Set(),
            });
        }

        const data = routeMap.get(routeKey);
        data.totalTrips += 1;
        data.totalPassengers += Number(trip.passengerCount) || 0;
        data.totalRevenue += Number(trip.revenue) || 0;
        data.freePassengers += Number(trip.freeTicketCount) || 0;
        data.halfPassengers += Number(trip.halfTicketCount) || 0;
        data.fullPassengers += Number(trip.fullTicketCount) || 0;
        data.routeIds.add(trip.routeId);
        if (trip.routeClosingVoucherId) {
            data.uniqueVoucherIds.add(trip.routeClosingVoucherId.toString());
        }
    });

    return Array.from(routeMap.values()).map(data => ({
        ...data,
        totalTrips: formatNumber(data.uniqueVoucherIds.size),
        totalPassengers: formatNumber(data.totalPassengers),
        totalRevenue: formatNumber(Math.floor(data.totalRevenue)),
        freePassengers: formatNumber(data.freePassengers),
        halfPassengers: formatNumber(data.halfPassengers),
        fullPassengers: formatNumber(data.fullPassengers),
        averagePassengers: data.totalTrips ?
            formatNumber(Math.floor(data.totalPassengers / data.uniqueVoucherIds.size)) :
            formatNumber(0),
        routeCount: formatNumber(data.routeIds.size),
        routeIds: Array.from(data.routeIds),
        tripsCount: data.uniqueVoucherIds.size,
        voucherIds: Array.from(data.uniqueVoucherIds),
    }));
};


export const calculateMetricsStation = (
    filteredTrips: SavedTripInformation[],
    routes: Route[],
    isCity: boolean
): RouteMetric[] => {
    const routeMap = new Map<string, any>();

    filteredTrips.forEach(trip => {
        const route = routes.find(r => r.id.toString() === trip.routeId?.toString());
        if (!route) return;

        // Modify the key generation logic based on isCity flag
        const routeKey = isCity
            ? `${route.sourceCity}-${route.destinationCity}` // For city-to-city, use city pair
            : `${route.sourceAdda}-${route.destinationAdda}`; // For station-to-station, use station pair

        // If this routeKey doesn't exist, initialize it
        if (!routeMap.has(routeKey)) {
            routeMap.set(routeKey, {
                routeKey,
                sourceCity: route.sourceCity,
                destinationCity: route.destinationCity,
                sourceAdda: route.sourceAdda,
                destinationAdda: route.destinationAdda,
                routeId: route.id,
                totalTrips: 0,
                totalPassengers: 0,
                totalRevenue: 0,
                freePassengers: 0,
                halfPassengers: 0,
                fullPassengers: 0,
                routeIds: new Set(),
                tripCount: 0, // Added a new field to track trip count
            });
        }

        // Get the data for the current route
        const data = routeMap.get(routeKey);

        // For isCity = true, we count only unique trips
        if (isCity) {
            // Only increment totalTrips for unique voucher IDs (city-to-city aggregation)
            data.totalTrips += 1;
            data.routeIds.add(trip.routeId); // Ensure each route ID is counted only once
        } else {
            // For isCity = false, count each trip separately (station-to-station)
            data.totalTrips += 1;
            data.routeIds.add(trip.routeId); // Still aggregate by route IDs for reporting
        }

        // Always update passenger counts and revenue
        data.totalPassengers += Number(trip.passengerCount) || 0;
        data.totalRevenue += Number(trip.revenue) || 0;
        data.freePassengers += Number(trip.freeTicketCount) || 0;
        data.halfPassengers += Number(trip.halfTicketCount) || 0;
        data.fullPassengers += Number(trip.fullTicketCount) || 0;

        // Track number of trips for this station or city pair
        data.tripCount += 1;
    });

    // Now, return the aggregated metrics for each route
    return Array.from(routeMap.values()).map(data => ({
        ...data,
        totalTrips: formatNumber(data.totalTrips), // Show total trips
        totalPassengers: formatNumber(data.totalPassengers),
        totalRevenue: formatNumber(Math.floor(data.totalRevenue)),
        freePassengers: formatNumber(data.freePassengers),
        halfPassengers: formatNumber(data.halfPassengers),
        fullPassengers: formatNumber(data.fullPassengers),
        averagePassengers: data.totalTrips ?
            formatNumber(Math.floor(data.totalPassengers / data.totalTrips)) :
            formatNumber(0),
        routeCount: formatNumber(data.routeIds.size),
        routeIds: Array.from(data.routeIds),
        tripsCount: data.totalTrips, // Use total trips for the count
        voucherIds: Array.from(data.routeIds), // Display voucher IDs
    }));
};