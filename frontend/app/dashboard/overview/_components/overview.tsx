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
import { setSavedExpenses } from '@/lib/slices/saved-expenses';
import { useEffect, useState } from 'react';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllTrips } from '@/app/actions/trip.action';
import { setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { setSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { getAllRoutes } from '@/app/actions/route.action';
import { setRoute } from '@/lib/slices/route-slices';
import { LineGraph } from './line-graph';
import TripListingPage from './trip-listing-page';
import { formatNumber } from 'accounting';

// Helper function for calculating dynamic values
const calculateDynamicValue = (
  card: dashboardCardsT,
  filterVoucher: any,
  fetchedExpenses: Expense[]
): number => {
  const totalExpenses = calculateTotalExpenses(filterVoucher);
  const revenue = Number(filterVoucher?.revenue) || 0;
  const expenseAmount = fetchedExpenses[0]?.amount || 0;

  switch (card.id) {
    case 1:
      return (revenue + totalExpenses);
    case 2:
      return totalExpenses + expenseAmount;
    case 3:
      return revenue - expenseAmount;
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

// OverViewPage Component
export default function OverViewPage() {
  const dispatch = useDispatch();
  const [latestExpense, setLatestExpense] = useState<dashboardCardsT[]>(dashboardCards);

  const fetchAPI = async () => {
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

      const filterVoucher = fetchedVouchers.find(
        (voucher) => voucher.id === fetchedExpenses[0]?.busClosingVoucherId
      );

      if (filterVoucher) {
        const dynamicClosing = dashboardCards.map((card) => ({
          ...card,
          value: calculateDynamicValue(card, filterVoucher, fetchedExpenses),
        }));
        setLatestExpense(dynamicClosing);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Tabs defaultValue="overview" className="space-y-4">
          <h2 className="text-2xl font-bold">Latest Daily Closing</h2>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {latestExpense.map((card) => (
                <Card key={card.id}>
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
              <div className="col-span-4">
                <BarGraph />
              </div>
              <div className="col-span-4">
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
