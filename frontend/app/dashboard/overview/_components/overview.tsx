'use client'

import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { dashboardCards, dashboardCardsT } from '@/constants/data';
import { Expense, allExpenses } from '@/lib/slices/expenses-slices';
import { RootState } from '@/lib/store';
import { useDispatch, useSelector } from 'react-redux';
import { BarGraph } from './bar-graph';
import { getAllExpenses } from '@/app/actions/expenses.action';
import { allSavedExpenses, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllTrips } from '@/app/actions/trip.action';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { setSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { getAllRoutes } from '@/app/actions/route.action';
import { setRoute } from '@/lib/slices/route-slices';
import { LineGraph } from './line-graph';
import TripListingPage from './trip-listing-page';
import { formatNumber } from 'accounting';

// Define constant colors for the cards
const cardColors = [
  // '#F44336', // Red
  '#2196F3', // Blue
  // '#4CAF50', // Green
  // '#FFEB3B', // Yellow
  '#9C27B0', // Purple
  // '#00BCD4', // Cyan
  '#FF9800', // Orange
  '#607D8B', // Blue Grey
];

// Helper function for calculating dynamic values
const calculateDynamicValue = (
  card: dashboardCardsT,
  fetchedExpenses: any
): number => {
  switch (card.id) {
    case 1:
      return fetchedExpenses[0]?.revenue;
    case 2:
      return fetchedExpenses[0]?.expense;
    case 3:
      return fetchedExpenses[0]?.netIncome;
    default:
      return card.value;
  }
};

// Helper function to calculate total expenses
const calculateTotalExpenses = (voucher: any): number => {
  if (!voucher) return 0;
  return [
    voucher?.alliedmor,
    voucher?.cityParchi,
    voucher?.cleaning,
    voucher?.coilTechnician,
    voucher?.commission,
    voucher?.diesel,
    voucher?.refreshment,
    voucher?.toll,
    voucher?.miscellaneousExpense,
    voucher?.repair,
    voucher?.generator
  ]
    .reduce((sum, expense) => sum + (Number(expense) || 0), 0);
};

export default function OverViewPage() {
  const savedExpenses = useSelector<RootState, Expense[]>(allSavedExpenses);
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const dispatch = useDispatch();
  const [latestExpense, setLatestExpense] = useState<dashboardCardsT[]>(dashboardCards);

  const fetchAPI = useCallback(async () => {
    try {
      const [fetchedExpenses, fetchedVouchers, fetchTrip, fetchRoute] = await Promise.all([
        getAllExpenses(),
        getAllBusClosingVouchers(),
        getAllTrips(),
        getAllRoutes()
      ]);

      dispatch(setSavedExpenses(fetchedExpenses));
      dispatch(setBusClosingVoucher(fetchedVouchers));
      dispatch(setSavedTripInformation(fetchTrip));
      dispatch(setRoute(fetchRoute));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  const handleCalculateExpenses = (voucher: any) => {
    // Sum all expenses, ensuring proper field names and valid numeric conversions
    const allExpenses = [
      voucher?.alliedmor,
      voucher?.cityParchi,
      voucher?.cleaning,
      voucher?.coilTechnician,
      voucher?.commission,
      voucher?.diesel,
      voucher?.dieselLitres,
      voucher?.refreshment,
      voucher?.toll,
    ]
      .map(Number) // Convert all values to numbers
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    return allExpenses;
  };

  // Group expenses by date
  const aggregatedSummaryData = useMemo(() => {
    const groupedExpenses = savedExpenses.reduce((acc, expense) => {
      if (!acc[expense.date]) {
        acc[expense.date] = { revenue: 0, expense: 0, netIncome: 0, date: expense.date };
      }

      const voucher = vouchers.find(
        (voucher) => voucher.id === expense.busClosingVoucherId
      );
      const expenseCalc = Number(handleCalculateExpenses(voucher)) + Number(expense.amount)

      const sum = Number(voucher?.revenue) + Number(handleCalculateExpenses(voucher))

      if (voucher) {
        acc[expense.date].revenue += sum || 0;
      }

      acc[expense.date].expense += expenseCalc;
      acc[expense.date].netIncome = Number(acc[expense.date].revenue) - Number(acc[expense.date].expense);

      return acc;
    }, {} as Record<string, { revenue: number, expense: number, netIncome: number, date: string }>);

    const summaryData = Object.values(groupedExpenses);
    
    const aggregatedData = summaryData.reduce((acc, current) => {
      const dateKey = current.date.split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = { revenue: 0, expense: 0, netIncome: 0, date: dateKey };
      }

      acc[dateKey].revenue += current.revenue;
      acc[dateKey].expense += current.expense;
      acc[dateKey].netIncome += current.netIncome;

      return acc;
    }, {} as Record<string, { revenue: number; expense: number; netIncome: number; date: string }>);

    return Object.values(aggregatedData);
  }, [savedExpenses, vouchers]);

  const dynamicClosing = dashboardCards.map((card, index) => ({
    ...card,
    value: calculateDynamicValue(card, aggregatedSummaryData),
    backgroundColor: cardColors[index % cardColors.length], // Assign a constant color based on index
  }));

  useEffect(() => {
    setLatestExpense(dynamicClosing);
  }, [aggregatedSummaryData]);

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Tabs defaultValue="overview" className="space-y-4">
          <h2 className="text-2xl font-bold">Latest Daily Closing</h2>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {latestExpense.map((card) => (
                <Card
                  key={card.id}
                  style={{ backgroundColor: card?.backgroundColor }}
                  className='text-white'
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(card.value)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
              <div className="col-span-4 ">
                <BarGraph />
              </div>
              <div className="col-span-4 bg-gradient-border">
                <LineGraph />
              </div>
            </div>
            <TripListingPage />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
