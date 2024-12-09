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
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { SavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved';
import { getAllExpenses } from '@/app/actions/expenses.action';
import { setExpenses } from '@/lib/slices/expenses-slices';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';

type TTripListingPage = {};

export default function TripListingPage({ }: TTripListingPage) {
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const SavedTripInformation = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  // const routes = useSelector<RootState, Route[]>(allRoutes);
  // const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [pageLimit, setPageLimit] = useState(5);
  const dispatch = useDispatch();

  const fetchFixedTripExpense = async () => {
    const fetchFixedExpense = await getAllBusClosingVouchers();
    const routes = await getAllRoutes()
    dispatch(setBusClosingVoucher(fetchFixedExpense));
    dispatch(setRoute(routes));
    const tickets = await getAllTicketPrices()
    dispatch(setTicketRaw(tickets));
  };

  useEffect(() => {
    fetchFixedTripExpense()
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const countParam = searchParams.get('count') || '';
    const limitParam = searchParams.get('limit') || '5';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(countParam);
    setPageLimit(Number(limitParam));
  }, [searchParams,dispatch]);

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch = search
      ? voucher.alliedmor?.toString().includes(search.toLowerCase()) ||
      voucher.cityParchi?.toString().includes(search.toLowerCase()) ||
      voucher.cleaning?.toString().includes(search.toLowerCase()) ||
      voucher.coilTechnician?.toString().includes(search.toLowerCase()) ||
      voucher.date?.toString().includes(search.toLowerCase()) ||
      voucher.dieselLitres?.toString().includes(search.toLowerCase())
      : true;

      // const totalR = expenses.reduce((sum, expense) => {
      //   const foundVoucher = busClosingVouchers.find(v => v.id === expense.voucherId);
      //   if (foundVoucher) {
      //     return sum + (foundVoucher.revenue || 0);
      //   }
      //   return sum;
      // }, 0);
    // const matchesCount = source
    //   ? trip.routeCommission.toString() === source.toLowerCase() ||
    //   trip.rewardCommission.toString() === source.toLowerCase() ||
    //   trip.steward.toString() === source.toLowerCase() ||
    //   trip.counter.toString() === source.toLowerCase() ||
    //   trip.dcParchi.toString() === source.toLowerCase() ||
    //   trip.refreshment.toString() === source.toLowerCase()
    //   : true;

    return matchesSearch ;
  });

  const totalTripExpense = filteredVouchers.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = filteredVouchers.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Bus Closings (${totalTripExpense})`}
            description=""
          />
          {/* <NewTripDialog /> */}
        </div>
        <Separator />
        <TripTable data={paginatedTrips} totalData={totalTripExpense} />
      </div>
    </PageContainer>
  );
}
