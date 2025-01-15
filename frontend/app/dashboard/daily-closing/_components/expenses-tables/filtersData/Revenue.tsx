import useAccounting from '@/hooks/useAccounting';
import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector } from 'react-redux';

type VoucherProps = {
    voucherId: number;
};

const Revenue: React.FC<VoucherProps> = ({ voucherId }) => {
    const {formatNumber}  = useAccounting()
    const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);

    // Find the voucher with the given VoucherId
    const foundVoucher = vouchers.find((voucher) => voucher.id === voucherId);

    const allExpenses = [
        foundVoucher?.alliedmor,
        foundVoucher?.cityParchi,
        foundVoucher?.cleaning,
        foundVoucher?.cOilTechnician,
        foundVoucher?.commission,
        foundVoucher?.diesel,
        foundVoucher?.refreshment,
        foundVoucher?.toll,
        foundVoucher?.generator,
        foundVoucher?.repair,
        foundVoucher?.miscellaneousExpense,
    ]
        .map(Number)
        .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);


    return (
        <div>
            {foundVoucher ? (
                <p>{formatNumber(Number(foundVoucher.revenue)+allExpenses)}</p>
            ) : (
                <p>N/A</p>
            )}
        </div>
    );
};

export default Revenue;
