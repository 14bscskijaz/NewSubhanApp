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
    const busVouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
    // console.log(busVouchers, "routeId");
    const busVoucher = busVouchers.find((voucher) => voucher.id === routeId);
    // Find the voucher with the given VoucherId
    const foundRoute = routes.find((routes) => routes.id === busVoucher?.routeId);

    return (
        <div>
            {foundRoute ? (
                <p>{foundRoute?.sourceCity} - {foundRoute?.destinationCity}</p>
            ) : (
                <p>N/A</p>
            )}
        </div>
    );
};

export default Routes;
