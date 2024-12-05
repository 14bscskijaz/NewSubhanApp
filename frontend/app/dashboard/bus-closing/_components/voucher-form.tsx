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
  setVoucherNumber
}) => {
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const fixedClosingExpenses = useSelector<RootState, ClosingExpense[]>(
    allClosingExpenses
  );
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false); // Loading state
  const [expenses, setExpenses] = useState<number>(0);

  const routeFixedClosingExpense = useMemo(() => {
    return fixedClosingExpenses.find(
      (expense) => expense.routeId === Number(tripsInformation.at(-1)?.routeId)
    );
  }, [fixedClosingExpenses, tripsInformation]);

  const getExpenseValue = (expenseName: keyof ClosingExpense): number | null => {
    return routeFixedClosingExpense ? routeFixedClosingExpense[expenseName] : null;
  };

  const conductors = employees.filter(
    (employee) => employee.employeeType.toLowerCase() === 'conductor'
  );

  const methods = useForm({
    defaultValues: {
      busId: Number(busId),
      driverId: Number(driverId),
      conductorId: '',
      routeId: getExpenseValue('routeId'),
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
    console.log('Set total expense:', totalExpense);

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
    // console.log("Fixed trip expense: ", routeFixedClosingExpense);

    const subscription = methods.watch((data) => {
      handleRevenueCalculation(data);
    });

    return () => subscription.unsubscribe();
  }, [methods, tripRevenue]);

  const onSubmit = async (data: any) => {
    setLoading(true); // Set loading state
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

      const updatedTripInfo = tripsInformation.map((info: TripInformation) => ({
        ...info,
        routeClosingVoucherId: newVoucher?.id?.toString(),
      }));

      await Promise.all(
        updatedTripInfo.map(async (trip) => {
          await createTrip(trip);
        })
      );

      dispatch(setTripInformation([])); 
      // setBusId("")
      // setDriverId("")
      // setVoucherNumber("")
      methods.reset(); 
      setIsVoucherShow(false)
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Dropdown for Conductor */}
          <div>
            <Label htmlFor="conductorId">Conductor</Label>
            <Select
              onValueChange={(value) => methods.setValue('conductorId', value)}
              value={methods.watch('conductorId') || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Conductor">
                  {(() => {
                    const selectedConductor = conductors.find(
                      (c) => String(c.id) === String(methods.watch('conductorId'))
                    );
                    return selectedConductor
                      ? `${selectedConductor.firstName} ${selectedConductor.lastName}`
                      : 'Select Conductor';
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {conductors.map((conductor) => (
                  <SelectItem key={conductor?.id} value={String(conductor?.id)}>
                    {conductor.firstName + ' ' + conductor.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input id={field} type="number" {...methods.register(field as any)} />
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
