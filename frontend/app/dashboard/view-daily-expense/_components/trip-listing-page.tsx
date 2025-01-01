'use client';
import { getAllFixedTripExpenses } from '@/app/actions/FixedTripExpense.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Expense, setExpenses } from '@/lib/slices/expenses-slices';
import { allSavedExpenses, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExpenses } from '@/app/actions/expenses.action';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { useToast } from '@/hooks/use-toast';
import TripTable from "./trip-tables"

type TTripListingPage = {};

export default function TripListingPage({ }: TTripListingPage) {
  const savedExpenses = useSelector<RootState, Expense[]>(allSavedExpenses);
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pageLimit, setPageLimit] = useState(20);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const fetchFixedTripExpense = async () => {
    try {
      const fetchFixedExpense = await getAllExpenses();
      const vouchers = await getAllBusClosingVouchers();
      dispatch(setBusClosingVoucher(vouchers));
      dispatch(setSavedExpenses(fetchFixedExpense));
    } catch (error: any) {
      console.error(error.message);

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
        duration: 1000,
      });
    }
  };

  useEffect(() => {
    fetchFixedTripExpense();
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const limitParam = searchParams.get('limit') || '20';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setPageLimit(Number(limitParam));
  }, [searchParams, dispatch]);

  const uniqueExpenses = Array.from(
    new Map(savedExpenses.map((expense) => [expense.id, expense])).values()
  );

  const filteredExpense = uniqueExpenses.filter((expense) => {
    const matchesSearch = search
      ? expense.amount.toString().includes(search.toLowerCase()) ||
      expense.date.toString().includes(search.toLowerCase()) ||
      expense.description.toString().includes(search.toLowerCase()) ||
      expense.type.toString().includes(search.toLowerCase())
      : true;

    return matchesSearch;
  });

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
  // Group expenses by date
  const groupedExpenses = filteredExpense.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = { revenue: 0, expense: 0, netIncome: 0, date: expense.date };
    }

    // Find the voucher data associated with the current expense
    const voucher = vouchers.find(
      (voucher) => voucher.id === expense.busClosingVoucherId
    );
    const expenseCalc = Number(handleCalculateExpenses(voucher)) + Number(expense.amount)

    console.log(expenseCalc, "expenseCalc");

    // Accumulate revenue, expense, and calculate net income
    const sum = Number(voucher?.revenue) + Number(handleCalculateExpenses(voucher))
    console.log(sum, "sum");

    if (voucher) {
      acc[expense.date].revenue += sum || 0;
    }

    acc[expense.date].expense += expenseCalc;
    acc[expense.date].netIncome = Number(acc[expense.date].revenue) - Number(acc[expense.date].expense);

    return acc;
  }, {} as Record<string, { revenue: number, expense: number, netIncome: number, date: string }>);

  // Convert groupedExpenses object back to an array
  const summaryData = Object.values(groupedExpenses);
  // Summing up values with the same date
  const aggregatedData = summaryData.reduce((acc, current) => {
    // Extract the date without the time
    const dateKey = current.date.split('T')[0];

    if (!acc[dateKey]) {
      acc[dateKey] = { revenue: 0, expense: 0, netIncome: 0, date: dateKey };
    }

    // Aggregate the revenue, expense, and netIncome
    acc[dateKey].revenue += current.revenue;
    acc[dateKey].expense += current.expense;
    acc[dateKey].netIncome += current.netIncome;

    return acc;
  }, {} as Record<string, { revenue: number; expense: number; netIncome: number; date: string }>);

  // Convert the aggregated data object back to an array
  const aggregatedSummaryData = Object.values(aggregatedData);

  console.log(aggregatedSummaryData);


  // Pagination logic
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedExpense = aggregatedSummaryData.slice(startIndex, endIndex);

  const totalTripExpense = aggregatedSummaryData.length;

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Daily Closings (${totalTripExpense})`} description="" />
        </div>
        <Separator />
        {/* Replace with your table component for paginatedExpense */}
        <TripTable data={paginatedExpense} totalData={totalTripExpense} />
      </div>
    </PageContainer>
  );
}
