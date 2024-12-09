import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector } from 'react-redux';

type VoucherProps = {
    voucherId: number;
};

const Expense: React.FC<VoucherProps> = ({ voucherId }) => {
    const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);

    // Find the voucher with the given VoucherId
    const foundVoucher = vouchers.find((voucher) => voucher.id === voucherId);
    const allExpenses = Number(foundVoucher?.alliedmor)+
    Number(foundVoucher?.cityParchi)+
    Number(foundVoucher?.cleaning)+
    Number(foundVoucher?.coilTechnician)+
    Number(foundVoucher?.commission)+
    Number(foundVoucher?.diesel)+
    Number(foundVoucher?.dieselLitres)+
    Number(foundVoucher?.refreshment)+
    Number(foundVoucher?.toll);
    return (
        <div>
            {foundVoucher ? (
                <p>{allExpenses}</p>
            ) : (
                <p>N/A</p>
            )}
        </div>
    );
};

export default Expense;
