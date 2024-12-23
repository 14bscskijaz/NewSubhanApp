import useAccounting from '@/hooks/useAccounting'
import React from 'react'

type TripRevenueT = {
    tripRevenue: string
    TotalExpense: string
}
const NetExpenses = ({ tripRevenue, TotalExpense }: TripRevenueT) => {
    const {formatNumber}  = useAccounting()
    return (
        <div className='font-bold grid grid-cols-2 text-sm w-72 place-self-end mt-2'>
            <div className='border bg-gradient-border text-base px-2 py-1 rounded-tl-md text-gradient'>Description </div>
            <div className='border bg-gradient-border px-2 py-1 text-base rounded-tr-md text-gradient '>Value</div>
            <div className='border-x border-t bg-gradient-border  px-2 py-1 '>Gross Revenue </div>
            <div className='border-x border-t bg-gradient-border px-2 py-1  '>{formatNumber(Number(tripRevenue))} </div>
            <div className='border-x border-b bg-gradient-border px-2 py-1'>Total Expense </div>
            <div className='border-x border-b bg-gradient-border px-2 py-1 '>{formatNumber(Number(TotalExpense)) || 0} </div>
            <div className='border bg-gradient-border text-gradient px-2 py-1 rounded-bl-md text-base'>Gross Income </div>
            <div className='border bg-gradient-border px-2 py-1 rounded-br-md text-base'>{formatNumber(Number(tripRevenue) - Number(TotalExpense))}</div>

        </div>
    )
}

export default NetExpenses