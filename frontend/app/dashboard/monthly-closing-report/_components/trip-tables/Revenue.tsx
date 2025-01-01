import useAccounting from '@/hooks/useAccounting';
import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector } from 'react-redux';

type VoucherProps = {
    voucherId: number;
    amount: number;
};

const Revenue: React.FC<VoucherProps> = ({ voucherId, amount }) => {
    const { formatNumber } = useAccounting()
    const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);

    // Find the voucher with the given VoucherId
    const foundVoucher = vouchers.find((voucher) => voucher.id === voucherId);

    const allExpenses = [
        foundVoucher?.alliedmor,
        foundVoucher?.cityParchi,
        foundVoucher?.cleaning,
        foundVoucher?.coilTechnician,
        foundVoucher?.commission,
        foundVoucher?.diesel,
        foundVoucher?.dieselLitres,
        foundVoucher?.refreshment,
        foundVoucher?.toll,
    ]
        .map(Number)
        .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);


    return (
        <div>
            {foundVoucher ? (
                <p>{formatNumber(Number(foundVoucher.revenue) - Number(allExpenses + amount))}</p>
            ) : (
                <p>{amount?`(${amount})`:0}</p>
            )}
        </div>
    );
};

export default Revenue;