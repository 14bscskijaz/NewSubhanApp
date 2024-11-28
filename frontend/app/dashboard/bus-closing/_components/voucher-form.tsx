import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  allClosingExpenses,
  ClosingExpense
} from '@/lib/slices/fixed-closing-expense-slice';
import {
  allTripsInformation,
  TripInformation
} from '@/lib/slices/trip-information';
import NetExpenses from './net-expense';
import { Button } from '@/components/ui/button';

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
  const fixedClosingExpenses = useSelector<RootState, ClosingExpense[]>(
    allClosingExpenses
  );
  const tripsInformation = useSelector<RootState, TripInformation[]>(
    allTripsInformation
  );

  // Select the Fixed expenses, based on route, to use for this closing
  const routeFixedClosingExpense = fixedClosingExpenses.find(
    (expense) => expense.routeId === Number(tripsInformation.at(-1)?.routeId)
  );

  const getExpenseValue = (
    expenseName: keyof ClosingExpense
  ): number | null => {
    return routeFixedClosingExpense
      ? routeFixedClosingExpense[expenseName]
      : null;
  };

  const methods = useForm<BusClosingVoucher>({
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
      revenue: null, // tripRevenue - totalExpense
      date: new Date().toISOString() // Provide a valid default value
    }
  });

  const [expenses, setExpenses] = useState<number>(0);

  // Filter employees to get only conductors
  const conductors = employees.filter(
    (employee) => employee.employee_type.toLowerCase() === 'conductor'
  );

  const handleRevenueCalculation = (data: BusClosingVoucher) => {
    // Calculate total expenses
    const totalExpense =
      (data.commission || 0) +
      (data.diesel || 0) +
      (data.coilTechnician || 0) +
      (data.toll || 0) +
      (data.cleaning || 0) +
      (data.alliedmor || 0) +
      (data.cityParchi || 0) +
      (data.refreshment || 0);

    setExpenses(totalExpense);
    setTotalExpense(totalExpense.toString());

    // Calculate revenue
    methods.setValue('revenue', Number(tripRevenue) - totalExpense);
  };

  const subscription = methods.watch((data) => {
    handleRevenueCalculation(data as BusClosingVoucher);
  });

  useEffect(() => {
    console.log('value of commission: ', methods.getValues());

    return () => subscription.unsubscribe();
  }, [methods]);

  // Handle form submission
  const onSubmit = (data: BusClosingVoucher) => {
    // Here you can handle the form submission logic
    // For example, dispatching an action to save the data to the store or an API call
    console.log("Form submitted with data:", data);
    // You can also reset the form or close the modal after submission if needed
    methods.reset(); // Reset the form after submission if necessary
  };

  return (
    <FormProvider {...methods}>
      <form  onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-5">
        {/* Dropdown for Conductor */}
        <div className="grid gap-2">
          <Label htmlFor="conductorId">Conductor</Label>
          <Select
            onValueChange={(value) => methods.setValue('conductorId', value)}
            value={methods.watch('conductorId')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Conductor" />
            </SelectTrigger>
            <SelectContent>
              {conductors.map((conductor) => (
                <SelectItem key={conductor.id} value={conductor.id}>
                  {conductor.first_name + ' ' + conductor.last_name}
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
        <div className="col-span-3 flex justify-end mt-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BusClosingVoucherForm;
