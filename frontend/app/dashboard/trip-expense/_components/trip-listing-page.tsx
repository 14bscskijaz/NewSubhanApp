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
import { useToast } from '@/hooks/use-toast';

type TTripListingPage = {};

export default function TripListingPage({ }: TTripListingPage) {
  const trips = useSelector<RootState, FixedTripExpense[]>(allFixedTripExpenses);
  // const routes = useSelector<RootState, Route[]>(allRoutes);
  // const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [pageLimit, setPageLimit] = useState(20);
  const dispatch = useDispatch();
  const {toast} = useToast();

  const fetchFixedTripExpense = async () => {
    try {
      const fetchFixedExpense = await getAllFixedTripExpenses();
      const routes = await getAllRoutes();
      dispatch(setFixedTripExpense(fetchFixedExpense));
      dispatch(setRoute(routes));
      const tickets = await getAllTicketPrices();
      dispatch(setTicketRaw(tickets));
      
    } catch (error:any) {
      console.error(error.message);
      
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive",
        duration:1000
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
  }, [searchParams,dispatch]);

  const filteredTrip = trips.filter((trip) => {
    const matchesSearch = search
      ? trip.routeCommission.toString().includes(search.toLowerCase()) ||
      trip.rewardCommission.toString().includes(search.toLowerCase()) ||
      trip.steward.toString().includes(search.toLowerCase()) ||
      trip.counter.toString().includes(search.toLowerCase()) ||
      trip.dcParchi.toString().includes(search.toLowerCase()) ||
      trip.refreshment.toString().includes(search.toLowerCase())
      : true;

    const matchesCount = source
      ? trip.routeCommission.toString() === source.toLowerCase() ||
      trip.rewardCommission.toString() === source.toLowerCase() ||
      trip.steward.toString() === source.toLowerCase() ||
      trip.counter.toString() === source.toLowerCase() ||
      trip.dcParchi.toString() === source.toLowerCase() ||
      trip.refreshment.toString() === source.toLowerCase()
      : true;

    return matchesSearch && matchesCount;
  });

  const totalTripExpense = filteredTrip.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = filteredTrip.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Trip Expense (${totalTripExpense})`}
            description=""
          />
          <NewTripDialog />
        </div>
        <Separator />
        <TripTable data={paginatedTrips} totalData={totalTripExpense} />
      </div>
    </PageContainer>
  );
}
