'use client';
import PageContainer from '@/components/layout/page-container';
import { DatePicker } from '@/components/ui/date-picker';
import { Heading } from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
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
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';

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
    const allVouchers = await getAllBusClosingVouchers()
    console.log(allVouchers,"allVouchers");
    
    dispatch(setBus(allBusesData))
    dispatch(setRoute(allRoutes))
    dispatch(setBusClosingVoucher(allVouchers))
  }

  useEffect(() => {
    fetchEmoployee();

    const filteredData: Omit<Expense, 'id'>[] = busClosingVouchers
      .filter((voucher) =>
        selectedDate ? voucher.date.split('T')[0] === selectedDate.toISOString().split('T')[0] : true
      )
      .map((voucher) => {
        return {
          busId: Number(voucher.busId),
          voucherId: voucher.id,
          date: voucher.date,
          description: '',
          amount: 0,
          type: 'bus',
          routeId:voucher.routeId,
        };
      });

    dispatch(setExpenses(filteredData));
  }, [selectedDate]);




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
