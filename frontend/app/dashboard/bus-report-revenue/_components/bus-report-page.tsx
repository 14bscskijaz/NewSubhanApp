'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripTable from './trip-tables';
import { allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { allBuses, setBus } from '@/lib/slices/bus-slices';
import { setSavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved';
import { printExpenses } from './print';
import useAccounting from '@/hooks/useAccounting';
import { getAllBuses } from '@/app/actions/bus.action';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllTrips } from '@/app/actions/trip.action';
import { allSavedExpenses, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { getAllExpenses } from '@/app/actions/expenses.action';
import { groupVouchersByDate } from '@/lib/utils/voucher';
import { endOfDay, parseISO, startOfDay } from 'date-fns';

export default function BusReportPage() {
  const { formatNumber } = useAccounting();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Selectors
  const tripInfo = useSelector((state: RootState) => allSavedsavedTripsInformation(state));
  const expensesData = useSelector((state: RootState) => allSavedExpenses(state));
  const vouchers = useSelector((state: RootState) => allBusClosingVouchers(state));
  const buses = useSelector((state: RootState) => allBuses(state));

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allBus, allVoucher, allTrips, allExpenses] = await Promise.all([
          getAllBuses(),
          getAllBusClosingVouchers(),
          getAllTrips(),
          getAllExpenses(),
        ]);

        dispatch(setBus(allBus));
        dispatch(setBusClosingVoucher(allVoucher));
        dispatch(setSavedTripInformation(allTrips));
        dispatch(setSavedExpenses(allExpenses));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  // Get search filters
  const busNumberFilter = searchParams.get('busNumber') || '';
  const dateRange = searchParams.get('date')?.split('|') || [];
  const startDate = dateRange[0] ? startOfDay(parseISO(dateRange[0])) : null;
  const endDate = dateRange[1] ? endOfDay(parseISO(dateRange[1])) : null;

  // Filter and Group Vouchers (Memoized)
  const busData = useMemo(() => {
    const filteredVouchers = vouchers.filter((voucher) => {
      const voucherDate = parseISO(voucher.date);
      return (!startDate || voucherDate >= startDate) && (!endDate || voucherDate <= endDate);
    });

    return groupVouchersByDate(filteredVouchers, busNumberFilter, buses, expensesData);
  }, [vouchers, startDate, endDate, busNumberFilter, buses, expensesData]);

  // Pagination
  const page = Number(searchParams.get('page')) || 1;
  const pageLimit = Number(searchParams.get('limit')) || 10;
  const totalBusReport = busData.length;
  const paginatedTrips = busData.slice((page - 1) * pageLimit, page * pageLimit);

  // Print Function
  const handlePrint = () => {
    printExpenses(busData, buses, {
      dateRange: dateRange.length ? dateRange : undefined,
      busNumber: busNumberFilter || undefined,
    });
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Bus Report Revenue" description="" />
        </div>
        <Separator />
        <TripTable
          data={paginatedTrips}
          totalData={totalBusReport}
          printExpenses={handlePrint}
        />
      </div>
    </PageContainer>
  );
}
