import { createBusClosingVoucher, updateBusClosingVoucher } from '@/app/actions/BusClosingVoucher.action';
import { createTrip, updateTrip } from '@/app/actions/trip.action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { setBusClosing } from '@/lib/slices/bus-closing';
import { BusClosingVoucher, allBusClosingVouchers } from '@/lib/slices/bus-closing-voucher';
import { Buses, allBuses } from '@/lib/slices/bus-slices';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';
import {
  ClosingExpense,
  allClosingExpenses,
} from '@/lib/slices/fixed-closing-expense-slice';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
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
import useAccounting from '@/hooks/useAccounting';
import { useRouter } from 'next/navigation';
import format from 'date-fns/format';

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
  voucherData?: BusClosingVoucher;
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
  setConductorId,
  voucherData,
}) => {
  const { formatNumber } = useAccounting();
  const router = useRouter();
  const { toast } = useToast();
  const fixedClosingExpenses = useSelector<RootState, ClosingExpense[]>(
    allClosingExpenses
  );
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers)
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
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
      busId: voucherData?.busId ?? Number(busId),
      driverId: voucherData?.driverId ?? Number(driverId),
      conductorId: voucherData?.conductorId ?? Number(conductorId),
      routeId: voucherData?.routeId ?? Number(routeId),
      voucherNumber: voucherData?.voucherNumber ?? voucherNumber,
      commission: voucherData?.commission ?? getExpenseValue('driverCommission'),
      diesel: voucherData?.diesel ?? null,
      dieselLitres: voucherData?.dieselLitres ?? null,
      cOilTechnician: voucherData?.cOilTechnician ?? getExpenseValue('cOilExpense'),
      toll: voucherData?.toll ?? getExpenseValue('tollTax'),
      cleaning: voucherData?.cleaning ??
        (getExpenseValue("halfSafai") ?? 0) + (getExpenseValue("fullSafai") ?? 0),
      alliedmor: voucherData?.alliedmor ?? getExpenseValue('alliedMorde'),
      cityParchi: voucherData?.cityParchi ?? getExpenseValue('dcPerchi'),
      refreshment: voucherData?.refreshment ?? getExpenseValue('refreshmentRate'),
      repair: voucherData?.repair ?? null,
      challan: voucherData?.generator ?? null,
      miscellaneousExpense: voucherData?.miscellaneousExpense ?? null,
      explanation: voucherData?.explanation ?? "",
      revenue: voucherData?.revenue ?? 0,
      date: voucherData?.date ?? date,
    },
  });


  useEffect(() => {
    if (voucherData) {
      methods.reset({
        busId: voucherData.busId ?? Number(busId),
        driverId: voucherData.driverId ?? Number(driverId),
        conductorId: voucherData.conductorId ?? Number(conductorId),
        routeId: voucherData.routeId ?? Number(routeId),
        voucherNumber: voucherData.voucherNumber ?? voucherNumber,
        commission: voucherData.commission ?? getExpenseValue('driverCommission'),
        diesel: voucherData.diesel ?? null,
        dieselLitres: voucherData.dieselLitres ?? null,
        cOilTechnician: voucherData.cOilTechnician ?? getExpenseValue('cOilExpense'),
        toll: voucherData.toll ?? getExpenseValue('tollTax'),
        cleaning:
          voucherData.cleaning ??
          (getExpenseValue("halfSafai") ?? 0) + (getExpenseValue("fullSafai") ?? 0),
        alliedmor: voucherData.alliedmor ?? getExpenseValue('alliedMorde'),
        cityParchi: voucherData.cityParchi ?? getExpenseValue('dcPerchi'),
        refreshment: voucherData.refreshment ?? getExpenseValue('refreshmentRate'),
        repair: voucherData.repair ?? null,
        challan: voucherData.generator ?? null,
        miscellaneousExpense: voucherData.miscellaneousExpense ?? null,
        explanation: voucherData.explanation ?? "",
        revenue: voucherData.revenue ?? 0,
        date: voucherData.date ?? date,
      });
    }
  }, [voucherData, methods, busId, driverId, conductorId, routeId, voucherNumber, date]);



  const handleRevenueCalculation = (data: any) => {
    const totalExpense =
      (Number(data.commission) || 0) +
      (Number(data.diesel) || 0) +
      (Number(data.cOilTechnician) || 0) +
      (Number(data.toll) || 0) +
      (Number(data.cleaning) || 0) +
      (Number(data.alliedmor) || 0) +
      (Number(data.cityParchi) || 0) +
      (Number(data.refreshment) || 0) +
      (Number(data.repair) || 0) +
      (Number(data.challan) || 0) +
      (Number(data.miscellaneousExpense) || 0);

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
    const TicketMap = new Map(
      tickets.map(({ routeId, ticketPrice }) => [
        routeId,
        ticketPrice,
      ])
    );
    const filterDriver = employees.find(employee => Number(employee.id) === Number(data.driverId));
    const filterConductor = employees.find(employee => Number(employee.id) === Number(data.conductorId));

    const printContent = `
      <html>
        <head>
          <title>Bus Closing Voucher - New Subhan (Bus Service) </title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
              color: #333;
              font-size: 14px;
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
              border: 1px solid black;
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
            .header-class{
              color: #2a5934;
              font-size: 20px;
              font-weight: 700;
              border-bottom: 1px solid #000;
              padding: 5px;
              margin: 10px 0px ;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .text-bold{
              font-weight:700;
            }

            @media print {
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333;
                font-size: 14px;
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
                border: 1px solid black;
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
              .header-class{
                color: #2a5934;
                font-size: 20px;
                font-weight: 700;
                border-bottom: 1px solid #000;
                padding: 5px;
                margin: 10px 0px ;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
  
              .text-bold{
                font-weight:700;
              }
            }
          </style>
        </head>
        <body>
        <div class="header-class">
        <div>Bus Closing Voucher</div>
        <div>New Subhan</div>
      </div>
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
          <th>Passengers (Free)</th>
          <th>Ticket Fare</th>
          <th>Revenue</th>
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
              <td>${`${trip.passengerCount}(${trip.freeTicketCount})` || '-'}</td>
              <td>${TicketMap.get(Number(trip?.routeId)) || '-'}</td>
              <td>${trip.revenue || '-'}</td>
              </tbody>
            `}).join('')}
          </table>
          <div class="flex-right">
          <strong class="text-color">Total Revenue : </strong> ${tripRevenue}
          </div>
          </div>
          <div>
          <h2>Expenses</h2>
          <table>
            <tr><th>Type</th><td class="th-heading">Amount</td></tr>
            <tr><td>Commission</td><td>${formatNumber(data.commission) || '-'}</td></tr>
            <tr><td>Diesel Litres</td><td>${formatNumber(data.dieselLitres) || '-'}</td></tr>
            <tr><td>Miscellaneous</td><td>${formatNumber(data.miscellaneousExpense) || '-'}</td></tr>
            <tr><td>Challan</td><td>${formatNumber(data.challan) || '-'}</td></tr>
            <tr><td>Repair</td><td>${formatNumber(data.repair) || '-'}</td></tr>
            <tr><td>Refreshment</td><td>${formatNumber(data.refreshment) || '-'}</td></tr>
            <tr><td>City Parchi</td><td>${formatNumber(data.cityParchi) || '-'}</td></tr>
            <tr><td>Alliedmor</td><td>${formatNumber(data.alliedmor) || '-'}</td></tr>
            <tr><td>Cleaning</td><td>${formatNumber(data.cleaning) || '-'}</td></tr>
            <tr><td>Toll</td><td>${formatNumber(data.toll) || '-'}</td></tr>
            <tr><td>Coil Technician</td><td>${formatNumber(data.cOilTechnician) || '-'}</td></tr>
            <tr><td>Diesel</td><td>${formatNumber(data.diesel) || '-'}</td></tr>
          </table>
          <div class="flex-right">
          <strong class="text-color">Total Expenses : </strong> ${formatNumber(Number(TotalExpense))}
          </div>
          <h2>Summary</h2>
          <table>
          <tr>
            <td class="text-bold">Total Revenue</td>
            <td>${formatNumber(Number(tripRevenue))}</td>
          </tr>
          <tr>
            <td class="text-bold">Total Expenses</td>
            <td>${formatNumber(Number(TotalExpense))}</td>
          </tr>
          <tr>
            <th>Net Income</th>
            <td>${formatNumber(Number(tripRevenue) - Number(TotalExpense))}</td>
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
    console.log(data.date, 'date');
    const formattedDate = data.date ? format(new Date(data.date), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : null;
    // console.log(formattedDate, 'formattedDate');
    setLoading(true)
    try {
      const sanitizedData = {
        ...data,
        id: voucherData?.id,
        voucherNumber: Number(voucherNumber),
        busId: Number(data.busId),
        driverId: Number(data.driverId),
        conductorId: data.conductorId == 0 ? null : Number(data.conductorId),
        routeId: Number(data.routeId),
        commission: Number(data.commission) || 0,
        diesel: Number(data.diesel) || 0,
        dieselLitres: Number(data.dieselLitres) || 0,
        cOilTechnician: Number(data.cOilTechnician) || 0,
        toll: Number(data.toll) || 0,
        cleaning: Number(data.cleaning) || 0,
        alliedmor: Number(data.alliedmor) || 0,
        cityParchi: Number(data.cityParchi) || 0,
        refreshment: Number(data.refreshment) || 0,
        repair: Number(data.repair) || 0,
        generator: Number(data.challan) || 0,
        miscellaneousExpense: Number(data.miscellaneousExpense) || 0,
        explanation: data.explanation,
        revenue: Number(data.revenue) || 0,
      }

      let newVoucher: BusClosingVoucher | undefined;
      if (voucherData) {
        // Update existing voucher
        newVoucher = await updateBusClosingVoucher(voucherData.id, sanitizedData)

        // Process trips - update existing ones and create new ones
        const updatedTripInfo = tripsInformation.map(async (info: TripInformation) => {
          // If the trip already has a routeClosingVoucherId, it's an existing trip
          if (info.routeClosingVoucherId) {
            await updateTrip(info.id, info);
          } else {
            const updatedTrip = {
              ...info,
              routeClosingVoucherId: voucherData?.id ?? null,
            };

            await createTrip(updatedTrip);
          }
        });

        await Promise.all(updatedTripInfo);
        toast({
          title: "Success",
          description: "Bus closing voucher updated successfully!",
          variant: "default",
          duration: 1000,
        })

      } else {
        // Create new voucher
        newVoucher = await createBusClosingVoucher(sanitizedData)

        // Create all trips for new voucher
        const updatedTripInfo = tripsInformation.map((info: TripInformation) => ({
          ...info,
          routeClosingVoucherId: newVoucher?.id,
        }))

        await Promise.all(
          updatedTripInfo.map(async (trip: any) => {
            await createTrip(trip)
          }),
        )

        toast({
          title: "Success",
          description: "Bus closing voucher created successfully!",
          variant: "default",
          duration: 1000,
        })
      }

      dispatch(setTripInformation([]))
      dispatch(setBusClosing([]))
      setDriverId("")
      setBusId("")
      setConductorId("")
      setSelectedRoute("")
      setVoucherNumber("")
      methods.reset()
      setIsVoucherShow(false)

      // Trigger PDF print
      printPDF(sanitizedData);
      router.push('/dashboard/view-closing-voucher')
    } catch (error) {
      console.error("Error during submission:", error)

      // Show error toast
      toast({
        title: "Error",
        description: "An error occurred while processing the voucher.",
        variant: "destructive",
        duration: 1200,
      })
    } finally {
      setLoading(false)
    }
  }



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
            'alliedmor',
            'cOilTechnician',
            'toll',
            'cleaning',
            'cityParchi',
            'refreshment',
            'repair',
            'challan',
            'miscellaneousExpense',
          ].map((field) => {
            // Format the field name to include spaces
            const formattedLabel = field
              // Add space before uppercase letters
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              // Capitalize the first letter
              .replace(/^([a-z])/, (match) => match.toUpperCase());

            return (
              <div key={field}>
                <Label htmlFor={field}>{formattedLabel}</Label>
                <Input id={field} type="number" {...methods.register(field as any)} min={0} />
              </div>
            );
          })}


          <div className='col-span-3'>
            <Label htmlFor="miscellaneousExplanation">Explanation</Label>
            <Input
              id="miscellaneousExplanation"
              type="text"
              {...methods.register('explanation')}
            />
          </div>
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
            {loading ? "Submitting..." : voucherData ? "Edit Voucher" : "Submit"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BusClosingVoucherForm;
