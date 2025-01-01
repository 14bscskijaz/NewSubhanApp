'use client';
import { getAllFixedTripExpenses } from '@/app/actions/FixedTripExpense.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { FixedTripExpense, allFixedTripExpenses, setFixedTripExpense } from '@/lib/slices/fixed-trip-expense';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewTripDialog from './new-trip-dialogue';
import TripTable from './trip-tables';
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices';
import { TicketPriceRaw, allTicketsRaw, setTicketRaw } from '@/lib/slices/pricing-slices';
import { getAllTicketPrices } from '@/app/actions/pricing.action';
import { getAllRoutes } from '@/app/actions/route.action';
import { Expense, setExpenses } from '@/lib/slices/expenses-slices';
import { allSavedExpenses, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { getAllExpenses } from '@/app/actions/expenses.action';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { useToast } from '@/hooks/use-toast';

type TTripListingPage = {};

export default function TripListingPage({ }: TTripListingPage) {
  const savedExpenses = useSelector<RootState, Expense[]>(allSavedExpenses);
  // const routes = useSelector<RootState, Route[]>(allRoutes);
  // const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [pageLimit, setPageLimit] = useState(20);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const fetchFixedTripExpense = async () => {
    try {
      const fetchFixedExpense = await getAllExpenses();
      const routes = await getAllRoutes()
      const vouchers = await getAllBusClosingVouchers();
      dispatch(setBusClosingVoucher(vouchers))
      dispatch(setSavedExpenses(fetchFixedExpense));
      dispatch(setRoute(routes));
      const tickets = await getAllTicketPrices()
      dispatch(setTicketRaw(tickets));

    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      })
    }
  };

  useEffect(() => {
    fetchFixedTripExpense()
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const countParam = searchParams.get('count') || '';
    const limitParam = searchParams.get('limit') || '20';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(countParam);
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
      // expense.dcParchi.toString().includes(search.toLowerCase()) ||
      // expense.refreshment.toString().includes(search.toLowerCase())
      : true;

    return matchesSearch;
  });

  // console.log(filteredExpense, "filteredExpense");
  const sortedRoutes = filteredExpense.sort((a, b) => {
    return a.id - b.id;
  });

  const totalTripExpense = sortedRoutes.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedExpense = sortedRoutes.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Daily Closings (${totalTripExpense})`}
            description=""
          />
          {/* <NewTripDialog /> */}
        </div>
        <Separator />
        <TripTable data={paginatedExpense} totalData={totalTripExpense} />
      </div>
    </PageContainer>
  );
}
