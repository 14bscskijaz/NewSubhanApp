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
console.log(foundVoucher,'foundVoucher');

    // Sum all expenses, ensuring proper field names and valid numeric conversions
    const allExpenses = [
        foundVoucher?.alliedmor,
        foundVoucher?.cityParchi,
        foundVoucher?.cleaning,
        foundVoucher?.coilTechnician,
        foundVoucher?.commission,
        foundVoucher?.diesel,
        foundVoucher?.refreshment,
        foundVoucher?.toll,
    ]
        .map(Number) // Convert all values to numbers
        .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0); // Safely sum up all values

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
