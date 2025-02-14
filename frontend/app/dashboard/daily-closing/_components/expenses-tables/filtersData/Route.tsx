import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector } from 'react-redux';

type RouteProps = {
    routeId: number;
};

const Routes: React.FC<RouteProps> = ({ routeId }) => {
    const routes = useSelector<RootState, Route[]>(allRoutes);

    // Find the voucher with the given VoucherId
    const foundRoute = routes.find((routes) => routes.id === routeId);

    return (
        <div>
            {foundRoute ? (
                <p>{foundRoute.sourceCity} - {foundRoute.destinationCity}</p>
            ) : (
                <p>N/A</p>
            )}
        </div>
    );
};

export default Routes;
