import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector } from 'react-redux';

type VoucherProps = {
    voucherId: number;
};

const Revenue: React.FC<VoucherProps> = ({ voucherId }) => {
    const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);

    // Find the voucher with the given VoucherId
    const foundVoucher = vouchers.find((voucher) => voucher.id === voucherId);

    return (
        <div>
            {foundVoucher ? (
                <p>{foundVoucher.revenue}</p>
            ) : (
                <p>N/A</p>
            )}
        </div>
    );
};

export default Revenue;
