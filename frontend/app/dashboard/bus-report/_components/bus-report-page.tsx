'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BusReport, allBusReports } from '@/lib/slices/Report/bus-report-slice';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripTable from './trip-tables';
import { TripInformation, allTripsInformation } from '@/lib/slices/trip-information';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices';
import { SavedTripInformation, allSavedsavedTripsInformation, setSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { printExpenses } from './print';
import useAccounting from '@/hooks/useAccounting';
import { getAllBuses } from '@/app/actions/bus.action';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllTrips } from '@/app/actions/trip.action';
import { allSavedExpenses, Expense, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { allExpenses } from '@/lib/slices/expenses-slices';
import { getAllExpenses } from '@/app/actions/expenses.action';


export default function BusReportPage() {
  const {formatNumber}  = useAccounting()

  const tripInfo = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const expensesData = useSelector<RootState,Expense[]>(allSavedExpenses);  
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>('');
  const [pageLimit, setPageLimit] = useState(10);
  const dispatch = useDispatch();

  
  useEffect(() => {
    const fetchData = async() =>{
      const allBus = await getAllBuses();
      dispatch(setBus(allBus));
      const allVoucher = await getAllBusClosingVouchers();
      dispatch(setBusClosingVoucher(allVoucher));
      const allTrips = await getAllTrips();
      dispatch(setSavedTripInformation(allTrips));
      const allExpenses = await getAllExpenses();
      dispatch(setSavedExpenses(allExpenses));
      
    }
    
    const searchParam = searchParams.get('q') || '';
    const pageLimitParam = searchParams.get('limit') || 10;
    const pageParam = searchParams.get('page') || 1;
    setPageLimit(Number(pageLimitParam));
    setPage(Number(pageParam));
    setSearch(searchParam);
    fetchData()
  }, [searchParams]);
  

  const calculateTotalExpenses = (voucher: BusClosingVoucher): number => {
    if (!voucher) {
      console.error("Voucher data is missing.");
      return 0;
    }
  console.log(voucher, 'voucher');
  
    const filterExpenses = expensesData.filter(
      (expense) => expense.busClosingVoucherId === voucher.id
    );
  console.log(filterExpenses, 'filterExpenses');
  
    const total = filterExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
    return total;
  };
  
  

  const busMetrics = useCallback(() => {
    const dateRange = searchParams.get('date')?.split('|') || [];
    const busNumberFilter = searchParams.get('busNumber') || '';
    const busOwnerFilter = searchParams.get('busOwner') || '';
    const searchParam = searchParams.get('q') || '';
    

    // Normalize searchParam for comparison
    const normalizedSearchParam = searchParam.toLowerCase();

    // Parse date range
    const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
    const endDate = dateRange[1] ? new Date(dateRange[1]) : null;

    const busMap = new Map<string, any>();
    const processedVoucherIds = new Set<string>(); // Track processed vouchers for expenses and revenue

    tripInfo
      .filter((trip) => {
        const voucher = vouchers.find((v) => v.id === trip.routeClosingVoucherId);
        if (!voucher) return false;

        // Apply date range filter
        if (startDate && endDate) {
          const tripDate = new Date(voucher.date);
          if (tripDate < startDate || tripDate > endDate) return false;
        }

        // Apply bus number and bus owner filters
        const bus = buses.find((b) => b.id === voucher.busId);
        if (!bus) return false;

        if (busNumberFilter && bus.busNumber !== busNumberFilter) return false;
        if (busOwnerFilter && bus.busOwner !== busOwnerFilter) return false;

        return true;
      })
      .forEach((trip) => {
        const voucher = vouchers.find((v) => v.id === trip.routeClosingVoucherId);
        const bus = buses.find((b) => b.id === voucher?.busId);

        const busNumber = bus?.busNumber || 'Unknown Bus Number';
        const busOwner = bus?.busOwner || 'Unknown Bus Owner';

        if (!busMap.has(busNumber)) {
          busMap.set(busNumber, {
            busNumber,
            busOwner,
            totalTrips: 0,
            totalPassengers: 0,
            totalExpenses: 0,
            totalRevenue: 0,
            uniqueVoucherIds: new Set(),
          });
        }

        const busData = busMap.get(busNumber);
        busData.totalTrips += 1;
        busData.totalPassengers += Number(trip?.passengerCount) || 0;

        // Only add expenses and revenue if the voucher hasn't been processed yet
        if (voucher?.id && !processedVoucherIds.has(voucher.id.toString())) {
          busData.totalExpenses += calculateTotalExpenses(voucher as any);
          busData.totalRevenue += Number(voucher.revenue || 0);
          processedVoucherIds.add(voucher.id.toString());
        }

        busData.uniqueVoucherIds.add(voucher?.id);
        busMap.set(busNumber, busData);
      });

    let busDataArray = Array.from(busMap.values()).map((data) => ({
      busNumber: data.busNumber,
      busOwner: data.busOwner,
      totalTrips: data.uniqueVoucherIds.size,
      totalPassengers: data.totalPassengers,
      totalRevenue: data.totalRevenue,
      totalExpenses: data.totalExpenses,
    }));

    // Filter busDataArray based on searchParam
    if (normalizedSearchParam) {
      busDataArray = busDataArray.filter((data) => {
        return (
          data.busNumber.toLowerCase().includes(normalizedSearchParam) ||
          data.busOwner.toLowerCase().includes(normalizedSearchParam) ||
          data.totalTrips.toString().toLowerCase().includes(normalizedSearchParam) ||
          data.totalPassengers.toString().includes(normalizedSearchParam) ||
          data.totalRevenue.toString().includes(normalizedSearchParam) ||
          data.totalExpenses.toString().includes(normalizedSearchParam)
        );
      });
    }

    return busDataArray;
  }, [tripInfo, vouchers, buses, searchParams]);
  
  
  

  const busData = busMetrics();

  const handlePrint = useCallback(() => {
    const dateRange = searchParams.get('date')?.split('|') || [];
    const busNumberFilter = searchParams.get('busNumber') || '';
    const busOwnerFilter = searchParams.get('busOwner') || '';

    printExpenses(busData, buses, {
        dateRange,
        busNumber: busNumberFilter,
        busOwner: busOwnerFilter,
    });
}, [busData, buses, searchParams]);


  const totalBusReport = busData.length;
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = busData.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div></div>
        <div className="flex items-start justify-between">
          <Heading
            title={`Bus Report (${totalBusReport})`}
            description=""
          />
          {/* <NewTripDialog /> */}
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

