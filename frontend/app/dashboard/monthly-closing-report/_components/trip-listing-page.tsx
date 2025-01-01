'use client';
import { getAllBusClosingVouchers } from '@/app/actions/BusClosingVoucher.action';
import { getAllBuses } from '@/app/actions/bus.action';
import { getAllTicketPrices } from '@/app/actions/pricing.action';
import { getAllRoutes } from '@/app/actions/route.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices';
import { setTicketRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices';
import { SavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripTable from './trip-tables';
import NewTripDialog from '../../trip-expense/_components/new-trip-dialogue';
import useAccounting from '@/hooks/useAccounting';
import { Expense, allExpenses } from '@/lib/slices/expenses-slices';
import { allSavedExpenses, setSavedExpenses } from '@/lib/slices/saved-expenses';
import { getAllExpenses } from '@/app/actions/expenses.action';

type TTripListingPage = {};

export default function TripListingPage({ }: TTripListingPage) {
  const { formatNumber } = useAccounting();

  const dailyClosings = useSelector<RootState, Expense[]>(allSavedExpenses);
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  // const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [busNumber, setSetBusNumber] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [pageLimit, setPageLimit] = useState(20);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const fetchFixedTripExpense = async () => {
    try {
      const fetchBusClosingExpense = await getAllBusClosingVouchers();
      const dailyClosings = await getAllExpenses();
      dispatch(setSavedExpenses(dailyClosings))
      dispatch(setBusClosingVoucher(fetchBusClosingExpense));
      const tickets = await getAllTicketPrices();
      dispatch(setTicketRaw(tickets));

    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      })
    }
  };

  useEffect(() => {
    fetchFixedTripExpense();
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const dateParam = searchParams.get('date') || '';
    const limitParam = searchParams.get('limit') || '20';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setDateFilter(dateParam);
    setPageLimit(Number(limitParam));
  }, [searchParams, dispatch]);

  const filteredVouchers = dailyClosings.filter((voucher) => {
    let startDate = 0;
    let endDate = 0;

    // If a date filter is provided, filter vouchers by the selected month
    if (dateFilter) {
      const selectedDate = new Date(dateFilter);
      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = selectedDate.getMonth();

      // Calculate the first and last date of the selected month
      const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
      const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

      startDate = firstDayOfMonth.setHours(0, 0, 0, 0);
      endDate = lastDayOfMonth.setHours(23, 59, 59, 999);
    }

    // Normalize voucher date to remove the time part for comparison
    const voucherDate = voucher.date ? new Date(voucher.date).getTime() : 0;

    // Match search filter
    const matchesSearch = search
      ? voucher.amount?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.description?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.date?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.type?.toString().toLowerCase().includes(search.toLowerCase())
      : true;

    // Match date range filter if set
    const matchesDateRange = startDate && endDate
      ? voucherDate >= startDate && voucherDate <= endDate
      : true;

    // Return combined match result
    return matchesSearch && matchesDateRange;
  });

  const filterVoucher = (id: number | null | undefined) => {
    return vouchers.find(voucher => voucher.id === id);
  }

  const totalRevenue = filteredVouchers.reduce((sum: number, item: Expense) => sum + (filterVoucher(item.busClosingVoucherId)?.revenue || 0), 0);

  const totalExpense = filteredVouchers.reduce((acc: any, item: Expense) => {
    const findedVoucher = filterVoucher(item.busClosingVoucherId);
    const expenses = [
      findedVoucher?.alliedmor,
      findedVoucher?.cityParchi,
      findedVoucher?.cleaning,
      findedVoucher?.coilTechnician,
      findedVoucher?.commission,
      findedVoucher?.diesel,
      findedVoucher?.refreshment,
      findedVoucher?.toll,
      findedVoucher?.miscellaneousExpense,
      findedVoucher?.repair,
      findedVoucher?.generator,
    ]
      .map(Number)
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

    return acc + expenses;
  }, 0)

  const handleCalculateExpenses = (voucher: any) => {
    // Sum all expenses, ensuring proper field names and valid numeric conversions
    const allExpenses = [
      voucher?.alliedmor,
      voucher?.cityParchi,
      voucher?.cleaning,
      voucher?.coilTechnician,
      voucher?.commission,
      voucher?.diesel,
      voucher?.refreshment,
      voucher?.toll,
      voucher?.miscellaneousExpense,
      voucher?.repair,
      voucher?.generator,
    ]
      .map(Number) // Convert all values to numbers
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    return allExpenses;
  };

  const printExpenses = () => {
    // Prepare the data for printing
    const voucherData = filteredVouchers.map((voucher) => {
      const findedVoucher = vouchers.find(vou => vou.id === voucher.busClosingVoucherId);
      console.log(voucher);

      const expenses = handleCalculateExpenses(findedVoucher);
      const grossRevenue = Number(findedVoucher?.revenue) || 0 - expenses;

      return {
        ...voucher,
        expenses,
        grossRevenue
      };
    });

    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Monthly Closing Report - New Subhan (Bus Service)</title>
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
                text-align: center;
                font-size:12px;
              }
              th {
                text-align: center;
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
              .text-left{
                text-align:left;
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
          <div>Monthly Closing Report</div>
          <div>New Subhan</div>
        </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue</th>
                  <th>Expense</th>
                  <th>Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${voucherData.map(voucher => {
        return `
                      <tr>
                        <td>${voucher?.date.split("T")[0]}</td>
                        <td>${formatNumber(Number(voucher.grossRevenue)) || 0}</td>
                        <td>${formatNumber(Number(voucher.expenses+voucher.amount))}</td>
                        <td>${formatNumber(Number(voucher.grossRevenue) - Number(voucher.expenses + voucher.amount)) || 0}</td>
                      </tr>
                    `;
      })
          .join('')}
              </tbody>
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


  const totalTripExpense = filteredVouchers.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = filteredVouchers.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Monthly Closings Report (${totalTripExpense})`}
            description=""
          />
          {/* <NewTripDialog /> */}
        </div>
        <Separator />
        <TripTable data={paginatedTrips} totalData={totalTripExpense} totalRevenue={totalRevenue} totalExpense={totalExpense} printExpenses={printExpenses} />
      </div>
    </PageContainer>
  );
}
