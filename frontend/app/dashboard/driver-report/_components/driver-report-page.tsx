'use client';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllBuses } from '@/app/actions/bus.action';
import { getAllEmployees } from '@/app/actions/employee.action';
import { getAllTrips } from '@/app/actions/trip.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import useAccounting from '@/hooks/useAccounting';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices';
import { Employee, allEmployees, setEmployee } from '@/lib/slices/employe-slices';
import { SavedTripInformation, allSavedsavedTripsInformation, setSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { printExpenses } from './print';
import TripTable from './trip-tables';

export default function DriverReportPage() {
  const { formatNumber } = useAccounting();

  const tripInfo = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const employees = useSelector<RootState, Employee[]>(allEmployees);

  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const dispatch = useDispatch();

  const driverFilterId = searchParams.get('driver');
  const selectedDate = searchParams.get('date') ? new Date(searchParams.get('date')!) : null;

  useEffect(() => {
    const fetchData = async () => {
      const allBus = await getAllBuses();
      dispatch(setBus(allBus));
      const allVoucher = await getAllBusClosingVouchers();
      dispatch(setBusClosingVoucher(allVoucher));
      const allEmployees = await getAllEmployees();
      dispatch(setEmployee(allEmployees));
      const allTrips = await getAllTrips();
      dispatch(setSavedTripInformation(allTrips));
    };

    fetchData();
  }, []);

  const driverMetrics = useCallback(() => {
    


    const driverMap = new Map<string, any>();

    tripInfo
      .filter((trip) => {
        const voucher = vouchers.find((v) => v.id === trip.routeClosingVoucherId);
        if (!voucher) return false;

        // Apply date filter
        if (selectedDate) {
          const tripDate = new Date(voucher.date);
          if (tripDate.toDateString() !== selectedDate.toDateString()) return false;
        }

        // Apply driver filter if specified
        if (driverFilterId && Number(voucher.driverId) !== Number(driverFilterId)) return false;

        return true;
      })
      .forEach((trip) => {
        const voucher = vouchers.find((v) => v.id === trip.routeClosingVoucherId);
        const bus = buses.find((b) => b.id === voucher?.busId);
        const filterDriver = employees.find((e) => Number(e.id) === Number(voucher?.driverId));
        const driver = `${filterDriver?.firstName} ${filterDriver?.lastName}` || 'Unknown Driver';
        const busType = bus?.busType || 'Unknown Bus Type';
        const dieselLitres = voucher?.dieselLitres || 0;

        if (!driverMap.has(driver)) {
          driverMap.set(driver, {
            driver,
            busType: new Set<string>(),
            trips: 0,
            diesel: 0,
          });
        }

        const driverData = driverMap.get(driver);
        driverData.busType.add(busType);
        driverData.trips += 1;
        driverData.diesel += dieselLitres;

        driverMap.set(driver, driverData);
      });

    return Array.from(driverMap.values()).map((data) => ({
      driver: data.driver,
      busType: Array.from(data.busType).join(', '),
      trips: formatNumber(data.trips),
      diesel: formatNumber(data.diesel),
    }));
  }, [tripInfo, vouchers, buses, employees, searchParams, formatNumber]);

  const driverData = driverMetrics();

  const totalDriverReport = driverData.length;
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedDrivers = driverData.slice(startIndex, endIndex);

  const handlePrint = useCallback(() => {
    const filterEmployee = employees?.find(emp => Number(emp?.id) === Number(driverFilterId))
    console.log(filterEmployee);
    
    return printExpenses(driverData as any,filterEmployee,selectedDate?.toISOString());
  }, [driverData]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div></div>
        <div className="flex items-start justify-between">
          <Heading
            title={`Driver Report (${totalDriverReport})`}
            description=""
          />
        </div>
        <Separator />
        <TripTable
          data={paginatedDrivers}
          totalData={totalDriverReport}
          printExpenses={handlePrint}
        />
      </div>
    </PageContainer>
  );
}
