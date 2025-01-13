'use client';

import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllExpenses } from '@/app/actions/expenses.action';
import { getAllRoutes } from '@/app/actions/route.action';
import { getAllTrips } from '@/app/actions/trip.action';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { dashboardCards, dashboardCardsT } from '@/constants/data';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { Expense } from '@/lib/slices/expenses-slices';
import { setRoute } from '@/lib/slices/route-slices';
import { allSavedExpenses, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { setSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RootState } from '@/lib/store';
import { formatNumber } from 'accounting';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarGraph } from './bar-graph';
import { LineGraph } from './line-graph';
import TripListingPage from './trip-listing-page';

// Define constant colors for the cards
const cardColors = [
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#607D8B', // Blue Grey
];

// Helper function for calculating dynamic values
const calculateDynamicValue = (card: dashboardCardsT, fetchedExpenses: any): number => {
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
    voucher?.cOilTechnician,
    voucher?.commission,
    voucher?.diesel,
    voucher?.refreshment,
    voucher?.toll,
    voucher?.miscellaneousExpense,
    voucher?.repair,
    voucher?.generator,
  ].reduce((sum, expense) => sum + (Number(expense) || 0), 0);
};

export default function OverViewPage() {
  const savedExpenses = useSelector<RootState, Expense[]>(allSavedExpenses);
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const dispatch = useDispatch();
  const [latestExpense, setLatestExpense] = useState<dashboardCardsT[]>(dashboardCards);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<dashboardCardsT | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const fetchAPI = useCallback(async () => {
    try {
      const [fetchedExpenses, fetchedVouchers, fetchTrip, fetchRoute] = await Promise.all([
        getAllExpenses(),
        getAllBusClosingVouchers(),
        getAllTrips(),
        getAllRoutes(),
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
    const allExpenses = [
      voucher?.alliedmor,
      voucher?.cityParchi,
      voucher?.cleaning,
      voucher?.cOilTechnician,
      voucher?.commission,
      voucher?.diesel,
      voucher?.dieselLitres,
      voucher?.refreshment,
      voucher?.toll,
    ]
      .map(Number)
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    return allExpenses;
  };

  // Group expenses by date
  const aggregatedSummaryData = useMemo(() => {
    const groupedExpenses = savedExpenses.reduce((acc, expense) => {
      if (!acc[expense.date]) {
        acc[expense.date] = { 
          revenue: 0, 
          expense: 0, 
          netIncome: 0, 
          date: expense.date, 
          expenseIds: [] // Add expenseIds array
        };
      }
  
      const voucher = vouchers.find(
        (voucher) => voucher.id === expense.busClosingVoucherId
      );
      const expenseCalc = Number(handleCalculateExpenses(voucher)) + Number(expense.amount);
  
      const sum = Number(voucher?.revenue) + Number(handleCalculateExpenses(voucher));
  
      if (voucher) {
        acc[expense.date].revenue += sum || 0;
      }
  
      acc[expense.date].expense += expenseCalc;
      acc[expense.date].netIncome =
        Number(acc[expense.date].revenue) - Number(acc[expense.date].expense);
      
      acc[expense.date].expenseIds.push(expense?.id.toString());
  
      return acc;
    }, {} as Record<string, { 
      revenue: number; 
      expense: number; 
      netIncome: number; 
      date: string; 
      expenseIds: string[]; // Include IDs
    }>);
  
    const summaryData = Object.values(groupedExpenses);
  
    const aggregatedData = summaryData.reduce((acc, current) => {
      const dateKey = current.date.split('T')[0];
  
      if (!acc[dateKey]) {
        acc[dateKey] = { 
          revenue: 0, 
          expense: 0, 
          netIncome: 0, 
          date: dateKey, 
          expenseIds: [] 
        };
      }
  
      acc[dateKey].revenue += current.revenue;
      acc[dateKey].expense += current.expense;
      acc[dateKey].netIncome += current.netIncome;
  
      // Merge expenseIds from the current entry
      acc[dateKey].expenseIds = [...acc[dateKey].expenseIds, ...current.expenseIds];
  
      return acc;
    }, {} as Record<string, { 
      revenue: number; 
      expense: number; 
      netIncome: number; 
      date: string; 
      expenseIds: string[]; 
    }>);
  
    return Object.values(aggregatedData);
  }, [savedExpenses, vouchers]);
  

  const handleCardClick = (card: dashboardCardsT) => {
    if (card.title === 'Expense') {
      // Extract and group expenses by bus ID from aggregated summary data
      const groupedExpenseDetails = aggregatedSummaryData.map((summary) => {
        const relatedExpenses = savedExpenses.filter((expense) =>
          summary.expenseIds.includes(expense.id.toString())
        );
  
        return {
          date: summary.date,
          expenses: relatedExpenses.map((expense) => ({
            busNumber: expense.busId,
            amount: expense.amount,
            description: expense.description,
          })),
        };
      });
  
      setSelectedExpense(groupedExpenseDetails);
      setModalOpen(true);
    }
  };
  
  // Helper function to get the latest day's data
  const getLatestDayData = () => {
    if (!selectedExpense || selectedExpense.length === 0) return null;
  
    const latestDay = selectedExpense.reduce((latest:any, current:any) => {
      return new Date(latest.date) > new Date(current.date) ? latest : current;
    });
  
    return latestDay;
  };
  
  const latestDayData = getLatestDayData();

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  const dynamicClosing = dashboardCards.map((card, index) => ({
    ...card,
    value: calculateDynamicValue(card, aggregatedSummaryData),
    backgroundColor: cardColors[index % cardColors.length],
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
                  className="text-white cursor-pointer"
                  onClick={() => handleCardClick(card)}
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
              <div className="col-span-4">
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

      {/* Modal Component */}
      {isModalOpen && latestDayData && (
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[940px] max-h-[570px] overflow-y-auto custom-scrollbar">
            <div className="p-6">
              <h3 className="text-xl font-bold">Expense <span className='text-gradient'>Details</span></h3>
              <p className="text-sm text-gray-600">Date: {latestDayData.date}</p>
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gradient-2 text-white">
                    <th className="border border-gray-300 p-2 text-left">Bus Number</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {latestDayData.expenses.map((expense:any, idx:number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{expense.busNumber}</td>
                      <td className="border border-gray-300 p-2">{expense.description}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatNumber(expense.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
