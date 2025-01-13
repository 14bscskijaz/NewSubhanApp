import useAccounting from '@/hooks/useAccounting';
import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector } from 'react-redux';

type VoucherProps = {
    voucherId: number;
    amount?: number;
};

const Expense: React.FC<VoucherProps> = ({ voucherId,amount }) => {
    const {formatNumber}  = useAccounting()
    const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
    // Find the voucher with the given VoucherId
    const foundVoucher = vouchers.find((voucher) => voucher.id === voucherId);

    // Sum all expenses, ensuring proper field names and valid numeric conversions
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
        // Convert all values to numbers
        .map(Number)
        // Safely sum up all values
        .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    const formattedExpenses = formatNumber(allExpenses+(amount||0));

    return (
        <div>
            {foundVoucher ? (
                <p>{formattedExpenses}</p>
            ) : (
                <p>{amount}</p>
            )}
        </div>
    );
};

export default Expense;
