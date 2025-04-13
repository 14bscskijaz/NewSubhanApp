'use client';
import { getAllBuses } from '@/app/actions/bus.action';
import { getAllBusClosingVouchers, updateBusClosingVoucher } from '@/app/actions/BusClosingVoucher.action';
import { createExpense, getAllExpenses, updateExpense } from '@/app/actions/expenses.action';
import { getAllRoutes } from '@/app/actions/route.action';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Heading } from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import useAccounting from '@/hooks/useAccounting';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices';
import { Expense, allExpenses, setExpenses } from '@/lib/slices/expenses-slices';
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices';
import { allSavedExpenses, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { SavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RouteTable from './expenses-tables';
import BusExpenseTable from './expenses-tables/bus-expense-table';
import NetExpenses from './net-expense';

type TExpensesListingPage = {};

export default function ExpensesListingPage({ }: TExpensesListingPage) {
  const { formatNumber } = useAccounting()
  const busClosingVouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const [loading, setLoading] = useState(false);
  const expenses = useSelector<RootState, Expense[]>(allExpenses);
  const savedExpenses = useSelector<RootState, Expense[]>(allSavedExpenses);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const savedTrips = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [generalPage, setGeneralPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pageLimit, setPageLimit] = useState(10);
  const [pageGeneralLimit, setPageGeneralLimit] = useState(10);
  const { toast } = useToast();

  const dispatch = useDispatch(); 

  const fetchData = async () => {
    const allBusesData = await getAllBuses();
    const allRoutes = await getAllRoutes();
    const allVouchers = await getAllBusClosingVouchers();
    const allExpenses = await getAllExpenses();
    // console.log(allExpenses,'allExpenses');

    dispatch(setBus(allBusesData))
    dispatch(setSavedExpenses(allExpenses))
    dispatch(setRoute(allRoutes))
    dispatch(setBusClosingVoucher(allVouchers))
  }

  useEffect(() => {
    const fetchFilteredData = () => {
      const normalizedSelectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

      const expensesForDate = savedExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const normalizedExpenseDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
        return normalizedExpenseDate.getTime() === normalizedSelectedDate.getTime();
      });

      const vouchersForDate = busClosingVouchers.filter((voucher) => {
        const voucherDate = new Date(voucher.date);
        const normalizedVoucherDate = new Date(
          voucherDate.getFullYear(),
          voucherDate.getMonth(),
          voucherDate.getDate()
        );
        return normalizedVoucherDate.getTime() === normalizedSelectedDate.getTime();
      });

      let updatedExpenses: Omit<Expense, 'id'>[] = [];

      // Include all expenses for the selected date
      updatedExpenses = expensesForDate.map(expense => ({
        ...expense,
        originalId: expense.id,
      }));

      // Add new expense entries for vouchers without corresponding expenses
      vouchersForDate?.forEach((voucher) => {
        if (!updatedExpenses.some(e => e.busClosingVoucherId === voucher.id)) {
          updatedExpenses.push({
            busId: Number(voucher.busId),
            busClosingVoucherId: voucher.id,
            date: voucher.date,
            description: '',
            amount: 0,
            type: 'bus',
            routeId: voucher.routeId,
            originalId: undefined,
          });
        }
      });
      if(expenses.length ===0){
        dispatch(setExpenses(updatedExpenses));
      }
    };

    fetchFilteredData();
  }, [selectedDate, busClosingVouchers, savedExpenses, dispatch]);



  // Effect to handle pagination parameters from the URL
  useEffect(() => {
    fetchData();
    const pageParam = searchParams.get('page') || '1';
    const pageGeneralParam = searchParams.get('generalPage') || '1';
    const limitParam = searchParams.get('limit') || '10';
    const limitGeneralParam = searchParams.get('generalLimit') || '10';

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
  );
  const generalExpensesPaginated = generalExpenses.slice(
    startIndexGeneral,
    startIndexGeneral + pageGeneralLimit
  );


  // Calculate the total amount for bus and general expenses
  const totalBusExpenses = busExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalGeneralExpenses = generalExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  const TotalExpense = totalBusExpenses + totalGeneralExpenses;

  const totalRevenue = expenses.reduce((sum, expense) => {
    const foundVoucher = busClosingVouchers.find(v => v.id === expense.busClosingVoucherId);
    const allExpenses = [
      foundVoucher?.alliedmor,
      foundVoucher?.cityParchi,
      foundVoucher?.cleaning,
      foundVoucher?.cOilTechnician,
      foundVoucher?.commission,
      foundVoucher?.diesel,
      foundVoucher?.refreshment,
      foundVoucher?.toll,
      foundVoucher?.generator,
      foundVoucher?.repair,
      foundVoucher?.miscellaneousExpense,
    ]
      .map(Number)
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);
    if (foundVoucher) {
      return sum + (Number(foundVoucher?.revenue) || 0);
    }
    return sum;
  }, 0);

  // Calculate total revenue (sum of bus and general expenses)

  const printExpenses = () => {
    // Create Maps for quick lookups
    const BusNumberMap = new Map(buses.map(({ id, busNumber }) => [id, busNumber]));
    const VoucherMap = new Map(
      busClosingVouchers.map(({ id, voucherNumber, revenue, routeId }) => [
        id,
        { voucherNumber, revenue, routeId },
      ])
    );
    const RouteMap = new Map(
      routes.map(({ id, sourceAdda, destinationAdda, destinationCity, sourceCity }) => [
        id,
        { sourceAdda, sourceCity, destinationAdda, destinationCity },
      ])
    );

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Expenses Report - New Subhan(Bus Service)</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f6f8;
                color: #333;
                margin: 0;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #333;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #e8f5e9;
                color: #2a5934;
              }
              tbody tr:nth-child(even) {
                background-color: #e8f5e9;
              }
              tbody tr:nth-child(odd) {
                background-color: #ffffff;
              }
              h1, h2 {
                color: #2a5934;
                border-bottom: 2px solid #333;
                padding-bottom: 5px;
              }
              tfoot th {
                background-color: #2a5934;
                color: #2a5934;
              }
              tfoot td {
                font-weight: bold;
                background-color: #d0e8d2;
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
            </style>
          </head>
          <body>
          <div class="header-class">
          <div>Daily Closing Report</div>
          <div>New Subhan</div>
        </div>
            <p><strong>Date:</strong> ${selectedDate.toLocaleDateString()}</p>

            <h2>Bus Expenses</h2>
            <table>
              <thead>
                <tr>
                  <th>Bus Number</th>
                  <th>Voucher Number</th>
                  <th>Revenue</th>
                  <th>Route</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${busExpenses
          .map(expense => {
            const voucher: any = VoucherMap.get(Number(expense?.busClosingVoucherId) || 0) || {};
            const {
              sourceCity = 'N/A',
              sourceAdda = 'N/A',
              destinationCity = 'N/A',
              destinationAdda = 'N/A',
            } = RouteMap.get(voucher.routeId || 0) || {};
            return `
                      <tr>
                        <td>${BusNumberMap.get(expense?.busId || 0) || 'N/A'}</td>
                        <td>${voucher.voucherNumber || 'N/A'}</td>
                        <td>${formatNumber(voucher.revenue) || 0}</td>
                        <td>${sourceCity !== 'N/A'
                ? `${sourceCity} - ${destinationCity}`
                : 'N/A'
              }</td>
                        <td>${expense.description || 'N/A'}</td>
                        <td>${formatNumber(expense.amount) || 0}</td>
                      </tr>
                    `;
          })
          .join('')}
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="5">Total Bus Expenses</th>
                  <td>${formatNumber(totalBusExpenses)}</td>
                </tr>
              </tfoot>
            </table>

            <h2>General Expenses</h2>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${generalExpenses
          .map(
            expense => `
                    <tr>
                      <td>${expense.description || 'N/A'}</td>
                      <td>${formatNumber(expense.amount) || 0}</td>
                    </tr>
                  `
          )
          .join('')}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total General Expenses</th>
                  <td>${formatNumber(totalGeneralExpenses)}</td>
                </tr>
              </tfoot>
            </table>

            <h2>Summary</h2>
            <table>
            <tr>
              <th>Total Revenue</th>
              <td>${formatNumber(totalRevenue)}</td>
            </tr>
              <tr>
                <th>Total Expenses</th>
                <td>${formatNumber(TotalExpense)}</td>
              </tr>
              <tr>
                <th>Net Income</th>
                <td>${formatNumber(totalRevenue - TotalExpense)}</td>
              </tr>
            </table>
          </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      toast({
        title: 'Error',
        description: 'Unable to open print window. Please check your browser settings.',
        variant: 'destructive',
        duration: 1500,
      });
    }
  };


  const handleSubmitExpenses = async () => {
    setLoading(true);
    try {
      const currentExpenseIds = new Set(expenses.map(e => e.originalId).filter(Boolean));
      const savedExpenseIds = new Set(savedExpenses.map(e => e.id));

      // Handle remaining expenses (create, update, or keep deleted)
      const expensePromises = expenses.map(async (expense) => {
        if (expense.type === 'bus') {
          const voucher = busClosingVouchers.find(v => v.id === expense.busClosingVoucherId);

          if (voucher && !voucher.isSubmitted) {
            // Update the busClosingVoucher isSubmitted status
            await updateBusClosingVoucher(voucher.id, { ...voucher, isSubmitted: true });
          }
        }

        if (expense.originalId) {
          // Update existing expense
          await updateExpense(expense.originalId, expense);
        } else if ((expense.amount > 0 || expense.description.trim() !== '') && expense.type === 'general') {
          // Create new general expense only if it has an amount or description
          await createExpense(expense);
        } else if (expense.type === 'bus') {
          // Always create new bus expenses
          await createExpense(expense);
        }
      });

      await Promise.all(expensePromises);

      toast({
        title: "Success",
        variant: "default",
        description: "Expenses submitted successfully!",
        duration: 3000,
      });

      setTimeout(() => {
        printExpenses();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to submit expenses. Please try again.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-center text-nowrap space-x-5">
          <Label htmlFor="date" className="text-gradient text-sm font-medium">
            Date
          </Label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | undefined) => date && setSelectedDate(date)}
            className="w-[300px]"
          />
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 relative">
          {/* Bus Expenses */}
          <div>
            <div className="flex items-start justify-between">
              <Heading title={`Daily Closing (${busExpenses.length})`} description="" />
            </div>
            <Separator />
            <BusExpenseTable data={busExpensesPaginnated} totalData={busExpenses.length} />
          </div>
          <div className='w-[1px] h-full left-[49.9%] bg-neutral-200 absolute hidden md:block'></div>
          <Separator className='md:hidden' />
          {/* General Expenses */}
          <div>
            <div className="flex items-start justify-between">
              <Heading title={`General Expenses (${generalExpenses.length})`} description="" />
            </div>
            <Separator />
            <RouteTable data={generalExpensesPaginated} totalData={generalExpenses.length} date={selectedDate} />

          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmitExpenses}
            disabled={loading || expenses?.length < 0}
            className={`${loading || expenses?.length < 0 ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
        {/* Pass the totalRevenue and expenses count to the NetExpenses component */}
        <NetExpenses
          TotalExpense={TotalExpense.toString()}
          tripRevenue={totalRevenue.toString()}
        />
      </div>
    </PageContainer>
  );
}

