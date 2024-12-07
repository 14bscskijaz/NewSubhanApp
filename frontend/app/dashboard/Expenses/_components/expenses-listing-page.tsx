'use client';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllBuses } from '@/app/actions/bus.action';
import { getAllRoutes } from '@/app/actions/route.action';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Heading } from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { setBus } from '@/lib/slices/bus-slices';
import { Expense, allExpenses, setExpenses } from '@/lib/slices/expenses-slices';
import { setRoute } from '@/lib/slices/route-slices';
import { SavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RouteTable from './expenses-tables';
import BusExpenseTable from './expenses-tables/bus-expense-table';

type TExpensesListingPage = {};

export default function ExpensesListingPage({ }: TExpensesListingPage) {
  const busClosingVouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const expenses = useSelector<RootState, Expense[]>(allExpenses);
  const savedTrips = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [generalPage, setGeneralPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [pageLimit, setPageLimit] = useState(5);
  const [pageGeneralLimit, setPageGeneralLimit] = useState(5);

  const dispatch = useDispatch();

  const fetchData = async () => {
    const allBusesData = await getAllBuses();
    const allRoutes = await getAllRoutes();
    const allVouchers = await getAllBusClosingVouchers()

    dispatch(setBus(allBusesData))
    dispatch(setRoute(allRoutes))
    dispatch(setBusClosingVoucher(allVouchers))
  }

  useEffect(() => {

    const fetchFilteredData = () => {
      // Normalize the selected date to avoid time zone issues
      const normalizedSelectedDate = selectedDate
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        : undefined;

      const filteredData: Omit<Expense, 'id'>[] = busClosingVouchers
        .filter((voucher) => {
          if (!normalizedSelectedDate) return true;

          const voucherDate = new Date(voucher.date);
          const normalizedVoucherDate = new Date(
            voucherDate.getFullYear(),
            voucherDate.getMonth(),
            voucherDate.getDate()
          );

          return normalizedVoucherDate.getTime() === normalizedSelectedDate.getTime();
        })
        .map((voucher) => {
          return {
            busId: Number(voucher.busId),
            voucherId: voucher.id,
            date: voucher.date,
            description: '',
            amount: 0,
            type: 'bus',
            routeId: voucher.routeId,
          };
        });

      dispatch(setExpenses(filteredData));
    };

    fetchFilteredData();
  }, [selectedDate, busClosingVouchers, dispatch]);


  // Effect to handle pagination parameters from the URL
  useEffect(() => {
    fetchData()
    const pageParam = searchParams.get('page') || '1';
    const pageGeneralParam = searchParams.get('generalPage') || '1';
    const limitParam = searchParams.get('limit') || '5';
    const limitGeneralParam = searchParams.get('generalLimit') || '5';

    setGeneralPage(Number(pageGeneralParam));
    setPageGeneralLimit(Number(limitGeneralParam));
    setPage(Number(pageParam));
    setPageLimit(Number(limitParam));
  }, [searchParams]);


  const busExpenses = expenses.filter((expense) => expense.type === 'bus');
  const generalExpenses = expenses.filter((expense) => expense.type === 'general');


  // Paginate the data
  const startIndex = (page - 1) * pageLimit;
  const startIndexGeneral = (generalPage - 1) * pageGeneralLimit;
  const busExpensesPaginnated = busExpenses.slice(
    startIndex,
    startIndex + pageLimit
  )
  const generalExpensesPaginated = generalExpenses.slice(
    startIndexGeneral,
    startIndexGeneral + pageGeneralLimit
  )
  console.log(generalExpensesPaginated,"generalExpensesPaginated");
  


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

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 relative">
          {/* Bus Expenses */}
          <div>
            <div className="flex items-start justify-between">
              <Heading title={`Bus Expenses (${busExpenses.length})`} description="" />

            </div>
            <Separator />
            <BusExpenseTable data={busExpensesPaginnated} totalData={busExpenses.length} />
          </div>
          <div className='w-[1px] h-full left-[49.9%] bg-neutral-200 absolute hidden md:block'></div>
          <Separator className='md:hidden'/>
          {/* General Expenses */}
          <div>
            <div className="flex items-start justify-between">
              <Heading title={`General Expenses (${generalExpenses.length})`} description="" />
            </div>
            <Separator />
            <RouteTable data={generalExpensesPaginated} totalData={generalExpenses.length} />
            <div className='flex justify-end mt-4'>
              <Button className=''>Submit Expense</Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
