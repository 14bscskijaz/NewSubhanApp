import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';
import {
  ClosingExpense,
  allClosingExpenses,
} from '@/lib/slices/fixed-closing-expense-slice';
import {
  TripInformation,
  allTripsInformation,
  setTripInformation,
} from '@/lib/slices/trip-information';
import { RootState } from '@/lib/store';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import NetExpenses from './net-expense';
import { createBusClosingVoucher } from '@/app/actions/BusClosingVoucher.action';
import { createTrip } from '@/app/actions/trip.action';
import { useToast } from '@/hooks/use-toast';
import { addSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { BusClosingVoucher, addBusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { Buses, allBuses } from '@/lib/slices/bus-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { setBusClosing } from '@/lib/slices/bus-closing';

interface BusClosingVoucherFormProps {
  driverId: string;
  busId: string;
  voucherNumber: string;
  setTotalExpense: Dispatch<SetStateAction<string>>;
  setVoucherNumber: Dispatch<SetStateAction<string>>;
  setBusId: Dispatch<SetStateAction<string>>;
  setDriverId: Dispatch<SetStateAction<string>>;
  setIsVoucherShow: Dispatch<SetStateAction<boolean>>;
  tripRevenue: string;
  TotalExpense: string;
  date: string | undefined;
  routeId: string;
  conductorId?: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>
  setConductorId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const BusClosingVoucherForm: React.FC<BusClosingVoucherFormProps> = ({
  driverId,
  busId,
  voucherNumber,
  setTotalExpense,
  tripRevenue,
  TotalExpense,
  date,
  setIsVoucherShow,
  setBusId,
  setDriverId,
  setVoucherNumber,
  routeId,
  conductorId,
  setSelectedRoute,
  setConductorId
}) => {
  const { toast } = useToast();
  const fixedClosingExpenses = useSelector<RootState, ClosingExpense[]>(
    allClosingExpenses
  );
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers)
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false); // Loading state
  const [expenses, setExpenses] = useState<number>(0);

  const routeFixedClosingExpense = useMemo(() => {
    return fixedClosingExpenses.find(
      (expense) => expense.routeId === Number(routeId)
    );
  }, [fixedClosingExpenses, tripsInformation]);

  const getExpenseValue = (expenseName: keyof ClosingExpense): number | null => {
    return routeFixedClosingExpense ? routeFixedClosingExpense[expenseName] : null;
  };



  const methods = useForm({
    defaultValues: {
      busId: Number(busId),
      driverId: Number(driverId),
      conductorId: Number(conductorId),
      routeId: Number(routeId),
      voucherNumber,
      commission: getExpenseValue('driverCommission'),
      diesel: null,
      dieselLitres: null,
      coilTechnician: getExpenseValue('cOilExpense'),
      toll: getExpenseValue('tollTax'),
      cleaning: null,
      alliedmor: getExpenseValue('alliedMorde'),
      cityParchi: getExpenseValue('dcPerchi'),
      refreshment: getExpenseValue('refreshmentRate'),
      repair: null,
      generator: null,
      miscellaneous: null,
      revenue: 0,
      date: date,
    },
  });

  const handleRevenueCalculation = (data: any) => {
    const totalExpense =
      (Number(data.commission) || 0) +
      (Number(data.diesel) || 0) +
      (Number(data.coilTechnician) || 0) +
      (Number(data.toll) || 0) +
      (Number(data.cleaning) || 0) +
      (Number(data.alliedmor) || 0) +
      (Number(data.cityParchi) || 0) +
      (Number(data.refreshment) || 0) +
      (Number(data.repair) || 0) +
      (Number(data.generator) || 0) +
      (Number(data.miscellaneous) || 0);

    setExpenses(totalExpense);
    setTotalExpense(totalExpense.toString());
    // console.log('Set total expense:', totalExpense);

    const calculatedRevenue = Number(tripRevenue) - Number(totalExpense);

    if (methods.getValues('revenue') !== calculatedRevenue) {
      methods.setValue('revenue', calculatedRevenue);
    }
  };

  useEffect(() => {
    handleRevenueCalculation(methods.getValues());
  }, []);

  useEffect(() => {

    // console.log("Form data", methods.getValues());
    // console.log("Fixed, based on route, Closing expense: ", routeFixedClosingExpense);

    const subscription = methods.watch((data) => {
      handleRevenueCalculation(data);
    });

    return () => subscription.unsubscribe();
  }, [methods, tripRevenue]);

  const printPDF = (data: any) => {
    const filterBus = buses.find(bus => Number(bus.id) === Number(data.busId));
    const filterRoute = routes.find(route => route.id === data.routeId);
    const RouteMap = new Map(
      routes.map(({ id, sourceAdda, destinationAdda, destinationCity, sourceCity }) => [
        id,
        { sourceAdda, sourceCity, destinationAdda, destinationCity },
      ])
    );
    const filterDriver = employees.find(employee => Number(employee.id) === Number(data.driverId));
    const filterConductor = employees.find(employee => Number(employee.id) === Number(data.conductorId));

    const printContent = `
      <html>
        <head>
          <title>Bus Closing Voucher and Trip Information</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
              color: #333;
              font-size: 12px;
            }
            h1, h2 {
              text-align: left;
              border-bottom: 2px solid #333;
              color: #2a5934;
            }
            table {
              width: 98%;
              margin: 20px auto;
              border-collapse: collapse;
              background-color: #fff;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px 4px;
              text-align: left;
            }
            th {
              background-color: #e8f5e9;
              color: #2a5934;
              text-transform: capitalize;
              letter-spacing: 1px;
            }
            .th-heading {
              font-weight:700;
              background-color: #e8f5e9;
              color: #2a5934;
              text-transform: capitalize;
              letter-spacing: 1px;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            tr:hover {
              background-color: #f1f1f1;
            }
            .grid-data{
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .report-grid{
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap:18px;
            }
            .voucher{
              grid-column: span 2 / span 2;
            }
            .flex-right{
              margin-right:9px;
              display:flex;
              justify-content:end;
            }
            .text-color{
              color:#2a5934;
            }
            .margin-top{
              margin-top:14px;
            }
          </style>
        </head>
        <body>
          <h1 class="margin-top">Bus Closing Voucher and Trip Information</h1>
          <div class="grid-data">
            <p><strong>Date : </strong> ${date ? new Date(date).toLocaleDateString() : 'All Dates'}</p>
            <p><strong>Bus : </strong> ${filterBus?.busNumber || '-'}</p>
            <p><strong>Voucher Number : </strong> ${data.voucherNumber || '-'}</p>
            <p><strong>Route : </strong> ${filterRoute?.sourceCity + " - " + filterRoute?.destinationCity || '-'}</p>
            <p><strong>Driver : </strong> ${filterDriver ? `${filterDriver.firstName} ${filterDriver.lastName}` : '-'}</p>
            <p><strong>Conductor : </strong> ${filterConductor ? `${filterConductor.firstName} ${filterConductor.lastName}` : '-'}</p>
          </div>
          <div class="report-grid">         
          <div class="voucher">
          <h2>Trip Infomation</h2>
          <table>
          <thead>
          <tr>
          <th>Route</th>
          <th>Passenger Count</th>
          <th>Actual Revenue</th>
          </tr>
          </thead>
            ${tripsInformation.map(trip => {
            const {
              sourceAdda = 'N/A',
              destinationAdda = 'N/A',
            } = RouteMap.get(Number(trip?.routeId)) || {};
            return `
              <tbody>
              <td>${sourceAdda + "-" + destinationAdda}</td>
              <td>${trip.passengerCount || '-'}</td>
              <td>${trip.actualRevenue || '-'}</td>
              </tbody>
            `}).join('')}
          </table>
          <div class="flex-right">
          <strong class="text-color">Total Revenue : </strong> ${tripRevenue}
          </div>
          </div>
          <div>
          <h2>Closing Voucher</h2>
          <table>
            <tr><th>Type</th><td class="th-heading">Amount</td></tr>
            <tr><th>Commission</th><td>${data.commission || '-'}</td></tr>
            <tr><th>Diesel Litres</th><td>${data.dieselLitres || '-'}</td></tr>
            <tr><th>Miscellaneous</th><td>${data.miscellaneous || '-'}</td></tr>
            <tr><th>Generator</th><td>${data.generator || '-'}</td></tr>
            <tr><th>Repair</th><td>${data.repair || '-'}</td></tr>
            <tr><th>Refreshment</th><td>${data.refreshment || '-'}</td></tr>
            <tr><th>City Parchi</th><td>${data.cityParchi || '-'}</td></tr>
            <tr><th>Alliedmor</th><td>${data.alliedmor || '-'}</td></tr>
            <tr><th>Cleaning</th><td>${data.cleaning || '-'}</td></tr>
            <tr><th>Toll</th><td>${data.toll || '-'}</td></tr>
            <tr><th>Coil Technician</th><td>${data.coilTechnician || '-'}</td></tr>
            <tr><th>Diesel</th><td>${data.diesel || '-'}</td></tr>
            <tr><th>Revenue</th><td>${data.revenue || '-'}</td></tr>
          </table>
          <h2>Summary</h2>
          <table>
          <tr>
            <th>Total Revenue</th>
            <td>${tripRevenue}</td>
          </tr>
          <tr>
            <th>Total Expenses</th>
            <td>${TotalExpense}</td>
          </tr>
          <tr>
            <th>Net Income</th>
            <td>${Number(tripRevenue) - Number(TotalExpense)}</td>
          </tr>
        </table>
          </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      console.error('Failed to open print window');
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const sanitizedData = {
        ...data,
        voucherNumber: Number(voucherNumber),
        busId: Number(data.busId),
        driverId: Number(data.driverId),
        conductorId: Number(data.conductorId),
        routeId: Number(data.routeId),
        commission: Number(data.commission) || 0,
        diesel: Number(data.diesel) || 0,
        dieselLitres: Number(data.dieselLitres) || 0,
        coilTechnician: Number(data.coilTechnician) || 0,
        toll: Number(data.toll) || 0,
        cleaning: Number(data.cleaning) || 0,
        alliedmor: Number(data.alliedmor) || 0,
        cityParchi: Number(data.cityParchi) || 0,
        refreshment: Number(data.refreshment) || 0,
        repair: Number(data.repair) || 0,
        generator: Number(data.generator) || 0,
        miscellaneous: Number(data.miscellaneous) || 0,
        revenue: Number(data.revenue) || 0,
      };

      const newVoucher = await createBusClosingVoucher(sanitizedData);

      // dispatch(addBusClosingVoucher(sanitizedData));
      // const newVoucher = vouchers[vouchers.length - 1];

      const updatedTripInfo = tripsInformation.map((info: TripInformation) => ({
        ...info,
        routeClosingVoucherId: newVoucher?.id?.toString(),
      }));

      await Promise.all(
        updatedTripInfo.map(async (trip) => {
          await createTrip(trip);
          // dispatch(addSavedTripInformation(trip))
        })
      );

      dispatch(setTripInformation([]));
      dispatch(setBusClosing([]));
      setDriverId("");
      setBusId("");
      setConductorId("");
      setSelectedRoute("");
      setVoucherNumber("")
      methods.reset();
      setIsVoucherShow(false);

      // Show success toast
      toast({
        title: 'Success',
        description: 'Bus closing voucher created successfully!',
        variant: 'default',
        duration: 1000
      });

      printPDF(sanitizedData);
    } catch (error) {
      console.error('Error during submission:', error);

      // Show error toast
      toast({
        title: 'Error',
        description: 'An error occurred while creating the voucher.',
        variant: 'destructive',
        duration: 1200
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 mt-2 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Dropdown for Conductor */}


          {/* Input Fields */}
          {[
            'commission',
            'diesel',
            'dieselLitres',
            'coilTechnician',
            'toll',
            'cleaning',
            'alliedmor',
            'cityParchi',
            'refreshment',
            'repair',
            'generator',
            'miscellaneous',
          ].map((field) => (
            <div key={field} >
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input id={field} type="number" {...methods.register(field as any)} min={0} />
            </div>
          ))}

          {/* Revenue */}
          <div>
            <Label htmlFor="revenue">Revenue</Label>
            <Input id="revenue" type="number" value={methods.watch('revenue')} disabled />
          </div>
        </div>

        <NetExpenses tripRevenue={tripRevenue} TotalExpense={TotalExpense} />

        {/* Submit Button */}
        <div className="col-span-3 flex justify-start md:justify-end mt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BusClosingVoucherForm;
