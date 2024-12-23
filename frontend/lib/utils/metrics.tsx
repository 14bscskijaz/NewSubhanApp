
import { SavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RouteMetric } from '@/types/trip';
import { Route } from '../slices/route-slices';
import { formatNumber } from './accounting';

export const calculateMetrics = (
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
            formatNumber(Math.floor(data.totalPassengers / data.totalTrips)) : 
            formatNumber(0),
        routeCount: formatNumber(data.routeIds.size),
        routeIds: Array.from(data.routeIds),
        tripsCount: data.uniqueVoucherIds.size,
        voucherIds: Array.from(data.uniqueVoucherIds),
    }));
};