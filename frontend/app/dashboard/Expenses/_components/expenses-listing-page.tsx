'use client';
import PageContainer from '@/components/layout/page-container';
import { DatePicker } from '@/components/ui/date-picker';
import { Heading } from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { Expense, allExpenses, setExpenses } from '@/lib/slices/expenses-slices';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RouteTable from './expenses-tables';
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices';
import { getAllBuses } from '@/app/actions/bus.action';
import { SavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved';
import { getAllRoutes } from '@/app/actions/route.action';
import { setRoute } from '@/lib/slices/route-slices';

type TExpensesListingPage = {};

export default function ExpensesListingPage({ }: TExpensesListingPage) {
  const busClosingVouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const expenses = useSelector<RootState, Expense[]>(allExpenses);
  const savedTrips = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [pageLimit, setPageLimit] = useState(10);

  const dispatch = useDispatch();

  const fetchEmoployee = async () => {
    const allBusesData = await getAllBuses();
    const allRoutes = await getAllRoutes();
    dispatch(setBus(allBusesData))
    dispatch(setRoute(allRoutes))
  }

  useEffect(() => {
    fetchEmoployee();

    const filteredData: Omit<Expense, 'id'>[] = busClosingVouchers
      .filter((voucher) =>
        selectedDate ? voucher.date === selectedDate.toISOString().split('T')[0] : true
      )
      .map((voucher) => {
        let idx = 0
        // Ensure both routeClosingVoucherId and voucher.id are numbers for comparison
        const relatedSavedTrips = savedTrips.filter((trip) => {
          const tripVoucherId = Number(trip.routeClosingVoucherId); // Ensure number
          const voucherId = Number(voucher.id); // Ensure number
          return tripVoucherId === voucherId;
        });

        // Get the first saved trip and extract its routeId, converting it to a number
        const routeId = relatedSavedTrips[idx]?.routeId
          ? Number(relatedSavedTrips[idx]?.routeId)
          : undefined;

        idx = idx + 1;
        return {
          busId: Number(voucher.busId),
          voucherId: voucher.id,
          date: voucher.date,
          description: '',
          amount: 0,
          type: 'bus',
          routeId,
        };
      });

    console.log(filteredData, "filteredData with routeId");
    dispatch(setExpenses(filteredData));
  }, [busClosingVouchers, selectedDate, savedTrips, dispatch]);




  // Effect to handle pagination parameters from the URL
  useEffect(() => {
    const pageParam = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  // Paginate the data
  const totalData = busClosingVouchers.length;
  const startIndex = (page - 1) * pageLimit;

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-center text-nowrap space-x-5">
          <Label htmlFor="date" className="text-gradient text-sm font-medium">
            Date
          </Label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-[300px]"
          />
        </div>
        <div className="flex items-start justify-between">
          <Heading title={`Expenses (${totalData})`} description="" />

        </div>
        <Separator />
        <div className="space-y-2">
          <RouteTable data={expenses} totalData={totalData} />
        </div>
      </div>
    </PageContainer>
  );
}
