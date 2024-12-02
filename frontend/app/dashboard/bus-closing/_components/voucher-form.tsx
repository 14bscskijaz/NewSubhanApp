import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';
import {
  ClosingExpense,
  allClosingExpenses
} from '@/lib/slices/fixed-closing-expense-slice';
import {
  TripInformation,
  allTripsInformation
} from '@/lib/slices/trip-information';
import { RootState } from '@/lib/store';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import NetExpenses from './net-expense';

// Define prop types
interface BusClosingVoucherFormProps {
  driverId: string;
  busId: string;
  voucherNumber: string;
  setTotalExpense: Dispatch<SetStateAction<string>>;
  tripRevenue: string
  TotalExpense: string
}

const BusClosingVoucherForm: React.FC<BusClosingVoucherFormProps> = ({
  driverId,
  busId,
  voucherNumber,
  setTotalExpense,
  tripRevenue,
  TotalExpense
}) => {
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const fixedClosingExpenses = useSelector<RootState, ClosingExpense[]>(allClosingExpenses);
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation);
 


  // Commented out the following function and related content
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
      busId,
      driverId,
      conductorId: '',
      voucherNumber,
      commission: getExpenseValue('driverCommission'),
      diesel: null,
      dieselLitres: null,
      coilTechnician: getExpenseValue('coilExpense'),
      toll: getExpenseValue('tollTax'),
      cleaning: null,
      alliedmor: getExpenseValue('alliedMorde'),
      cityParchi: getExpenseValue('dcParchi'),
      refreshment: getExpenseValue('refreshmentRate'),
      revenue: 0,
      date: new Date().toISOString()
    }
  });

  const [expenses, setExpenses] = useState<number>(0);

  // Function to calculate total expenses and update the revenue
  const handleRevenueCalculation = (data: any) => {
    const totalExpense =
      (Number(data.commission) || 0) +
      (Number(data.diesel) || 0) +
      (Number(data.coilTechnician) || 0) +
      (Number(data.toll) || 0) +
      (Number(data.cleaning) || 0) +
      (Number(data.alliedmor) || 0) +
      (Number(data.cityParchi) || 0) +
      (Number(data.refreshment) || 0);

    setExpenses(totalExpense);
    setTotalExpense(totalExpense.toString());

    // Calculate revenue
    const calculatedRevenue = Number(tripRevenue) - Number(totalExpense);

    // Only update revenue if it has changed
    if (methods.getValues('revenue') !== calculatedRevenue) {
      methods.setValue('revenue', calculatedRevenue);
    }
  };


  // Watch form data and calculate expenses on change
  useEffect(() => {
    const subscription = methods.watch((data) => {
      handleRevenueCalculation(data);
    });

    return () => subscription.unsubscribe(); // Cleanup the subscription
  }, [methods, tripRevenue]);

  const onSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
    methods.reset();
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className='mt-4'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Dropdown for Conductor */}
          <div className="grid gap-2">
            <Label htmlFor="conductorId">Conductor</Label>
            <Select
              onValueChange={(value) => methods.setValue('conductorId', value)}
              value={methods.watch('conductorId') || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Conductor" />
              </SelectTrigger>
              <SelectContent>
                {conductors.map((conductor) => (
                  <SelectItem key={conductor.id} value={conductor.id}>
                    {conductor.firstName + ' ' + conductor.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Commission */}
          <div>
            <Label htmlFor="commission">Commission</Label>
            <Input
              id="commission"
              type="number"
              {...methods.register('commission', {
                required: 'Commission is required'
              })}
            />
          </div>

          {/* Diesel */}
          <div>
            <Label htmlFor="diesel">Diesel</Label>
            <Input
              id="diesel"
              type="number"
              {...methods.register('diesel', {
                required: 'Diesel is required'
              })}
            />
          </div>

          {/* Diesel Litres */}
          <div>
            <Label htmlFor="dieselLitres">Diesel Litres</Label>
            <Input
              id="dieselLitres"
              type="number"
              {...methods.register('dieselLitres', {
                required: 'Diesel Litres is required'
              })}
            />
          </div>

          {/* Coil Technician */}
          <div>
            <Label htmlFor="coilTechnician">Coil Technician</Label>
            <Input
              id="coilTechnician"
              type="number"
              {...methods.register('coilTechnician', {
                required: 'Coil Technician is required'
              })}
            />
          </div>

          {/* Toll */}
          <div>
            <Label htmlFor="toll">Toll</Label>
            <Input
              id="toll"
              type="number"
              {...methods.register('toll', {
                required: 'Toll is required'
              })}
            />
          </div>

          {/* Cleaning */}
          <div>
            <Label htmlFor="cleaning">Cleaning</Label>
            <Input
              id="cleaning"
              type="number"
              {...methods.register('cleaning', {
                required: 'Cleaning is required'
              })}
            />
          </div>

          {/* Alliedmor */}
          <div>
            <Label htmlFor="alliedmor">Alliedmor</Label>
            <Input
              id="alliedmor"
              type="number"
              {...methods.register('alliedmor', {
                required: 'Alliedmor is required'
              })}
            />
          </div>

          {/* City Parchi */}
          <div>
            <Label htmlFor="cityParchi">City Parchi</Label>
            <Input
              id="cityParchi"
              type="number"
              {...methods.register('cityParchi', {
                required: 'City Parchi is required'
              })}
            />
          </div>

          {/* Refreshment */}
          <div>
            <Label htmlFor="refreshment">Refreshment</Label>
            <Input
              id="refreshment"
              type="number"
              {...methods.register('refreshment', {
                required: 'Refreshment is required'
              })}
            />
          </div>

          {/* Expenses */}
          <div>
            <Label htmlFor="expenses">Expenses</Label>
            <Input id="expenses" type="number" value={expenses} disabled />
          </div>
        </div>

        <NetExpenses
          tripRevenue={tripRevenue}
          TotalExpense={TotalExpense}
        />

        {/* Submit Button */}
        <div className="col-span-3 flex justify-start md:justify-end mt-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BusClosingVoucherForm;
