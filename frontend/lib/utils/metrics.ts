import { SavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RouteMetric } from '@/types/trip';
import { Route } from '../slices/route-slices';
import useAccounting from '@/hooks/useAccounting';

export const calculateMetrics = (
    filteredTrips: SavedTripInformation[],
    routes: Route[],
    isCity: boolean
): RouteMetric[] => {
    const {formatNumber}  = useAccounting()
    const routeMap = new Map<string, any>();

    filteredTrips.forEach(trip => {
        const route = routes.find(r => r.id.toString() === trip.routeId?.toString());
        if (!route) return;

        const routeKey = isCity
            ? `${route.sourceCity}-${route.destinationCity}`
            : `${route.sourceAdda}-${route.destinationAdda}`;

        if (!routeMap.has(routeKey)) {
            routeMap.set(routeKey, {
                routeKey,
                [isCity ? 'sourceCity' : 'sourceAdda']: isCity ? route.sourceCity : route.sourceAdda,
                [isCity ? 'destinationCity' : 'destinationAdda']: isCity ? route.destinationCity : route.destinationAdda,
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
        totalRevenue: formatNumber(Math.floor(data.totalRevenue)),
        averagePassengers: data.totalTrips ? formatNumber(Math.floor(data.totalPassengers / data.totalTrips)) : 0,
        routeCount: formatNumber(data.routeIds.size),
        routeIds: Array.from(data.routeIds),
        tripsCount: data.uniqueVoucherIds.size,
        voucherIds: Array.from(data.uniqueVoucherIds),
    }));
};

