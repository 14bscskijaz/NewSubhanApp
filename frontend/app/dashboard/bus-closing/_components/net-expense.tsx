import React from 'react'

type TripRevenueT = {
    tripRevenue: string
    TotalExpense: string
}
const NetExpenses = ({ tripRevenue, TotalExpense }: TripRevenueT) => {
    return (
        <div className='text-lg font-bold flex  mt-8 '>
            <div className='flex flex-col'>
                <div>Trips Revenue </div>
                <div>Route Expense </div>
                <div>Gross Revenue </div>
            </div>
            <div className='flex flex-col'>
                <div> : {tripRevenue} </div>
                <div> : {TotalExpense} </div>
                <div> : {Number(tripRevenue) - Number(TotalExpense)}</div>
            </div>

        </div>
    )
}

export default NetExpenses