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
import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { Buses, allBuses } from '@/lib/slices/bus-slices';
import { SavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved';
import { printExpenses } from './print';
import useAccounting from '@/hooks/useAccounting';


export default function BusReportPage() {
  const {formatNumber}  = useAccounting()

  const tripInfo = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  const calculateTotalExpenses = (voucher: BusClosingVoucher): number => {
    return (
      Math.floor(voucher.commission || 0) +
      Math.floor(voucher.diesel || 0) +
      Math.floor(voucher.coilTechnician || 0) +
      Math.floor(voucher.toll || 0) +
      Math.floor(voucher.cleaning || 0) +
      Math.floor(voucher.alliedmor || 0) +
      Math.floor(voucher.cityParchi || 0) +
      Math.floor(voucher.refreshment || 0)
    );
  };

  const busMetrics = useCallback(() => {
    const dateRange = searchParams.get('date')?.split('|') || [];
    const busNumberFilter = searchParams.get('busNumber') || '';
    const busOwnerFilter = searchParams.get('busOwner') || '';
  
    // Parse date range
    const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
    const endDate = dateRange[1] ? new Date(dateRange[1]) : null;
  
    const busMap = new Map<string, any>();
  
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
        busData.totalPassengers += Number(trip.passengerCount) || 0;
        busData.totalRevenue += Number(voucher?.revenue || 0);
        busData.totalExpenses += calculateTotalExpenses(voucher as any);
        busData.uniqueVoucherIds.add(voucher?.id);
        busMap.set(busNumber, busData);
      });
  
    return Array.from(busMap.values()).map((data) => ({
      busNumber: data.busNumber,
      busOwner: data.busOwner,
      totalTrips: formatNumber(data.uniqueVoucherIds.size),
      totalPassengers: formatNumber(data.totalPassengers),
      totalRevenue: formatNumber(data.totalRevenue),
      totalExpenses: formatNumber(data.totalExpenses),
    }));
  }, [tripInfo, vouchers, buses, searchParams]);
  

  const busData = busMetrics();

  const handlePrint = useCallback(() => {
    printExpenses(busData, buses);
  }, [busData, buses]);

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

