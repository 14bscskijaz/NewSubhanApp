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
      dispatch(setSavedExpenses(dailyClosings));
      dispatch(setBusClosingVoucher(fetchBusClosingExpense));
      const tickets = await getAllTicketPrices();
      dispatch(setTicketRaw(tickets));
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
        duration: 1000,
      });
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

    if (dateFilter) {
      const selectedDate = new Date(dateFilter);
      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = selectedDate.getMonth();

      const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
      const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

      startDate = firstDayOfMonth.setHours(0, 0, 0, 0);
      endDate = lastDayOfMonth.setHours(23, 59, 59, 999);
    }

    const voucherDate = voucher.date ? new Date(voucher.date).getTime() : 0;

    const matchesSearch = search
      ? voucher.amount?.toString().toLowerCase().includes(search.toLowerCase()) ||
        voucher.description?.toString().toLowerCase().includes(search.toLowerCase()) ||
        voucher.date?.toString().toLowerCase().includes(search.toLowerCase()) ||
        voucher.type?.toString().toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesDateRange = startDate && endDate ? voucherDate >= startDate && voucherDate <= endDate : true;

    return matchesSearch && matchesDateRange;
  });

  const uniqueExpenses = Array.from(new Map(filteredVouchers.map((expense) => [expense.id, expense])).values());

  const filteredExpense = uniqueExpenses.filter((expense) => {
    const matchesSearch = search
      ? expense.amount.toString().includes(search.toLowerCase()) ||
        expense.date.toString().includes(search.toLowerCase()) ||
        expense.description.toString().includes(search.toLowerCase()) ||
        expense.type.toString().includes(search.toLowerCase())
      : true;

    return matchesSearch;
  });

  const handleCalculateExpenses = (voucher: any) => {
    const allExpenses = [
      voucher?.alliedmor,
      voucher?.cityParchi,
      voucher?.cleaning,
      voucher?.cOilTechnician,
      voucher?.commission,
      voucher?.diesel,
      voucher?.dieselLitres,
      voucher?.refreshment,
      voucher?.toll,
    ]
      .map(Number)
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    return allExpenses;
  };

  const groupedExpenses = filteredExpense.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = { revenue: 0, expense: 0, netIncome: 0, date: expense.date };
    }

    const voucher = vouchers.find((voucher) => voucher.id === expense.busClosingVoucherId);
    const expenseCalc = Number(handleCalculateExpenses(voucher)) + Number(expense.amount);

    const sum = Number(voucher?.revenue) + Number(handleCalculateExpenses(voucher));

    if (voucher) {
      acc[expense.date].revenue += sum || 0;
    }

    acc[expense.date].expense += expenseCalc;
    acc[expense.date].netIncome = Number(acc[expense.date].revenue) - Number(acc[expense.date].expense);

    return acc;
  }, {} as Record<string, { revenue: number; expense: number; netIncome: number; date: string }>);

  const summaryData = Object.values(groupedExpenses);

  const aggregatedData = summaryData.reduce((acc, current) => {
    const dateKey = current.date.split('T')[0];

    if (!acc[dateKey]) {
      acc[dateKey] = { revenue: 0, expense: 0, netIncome: 0, date: dateKey };
    }

    acc[dateKey].revenue += current.revenue;
    acc[dateKey].expense += current.expense;
    acc[dateKey].netIncome += current.netIncome;

    return acc;
  }, {} as Record<string, { revenue: number; expense: number; netIncome: number; date: string }>);

  const aggregatedSummaryData = Object.values(aggregatedData);

  // Sorting the aggregated summary data by date (ascending)
  const sortedAggregatedSummaryData = aggregatedSummaryData.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Sort ascending by date (oldest first)
  });

  const printExpenses = () => {
    const voucherData = filteredVouchers.map((voucher) => {
      const findedVoucher = vouchers.find((vou) => vou.id === voucher.busClosingVoucherId);
      const expenses = handleCalculateExpenses(findedVoucher);
      const grossRevenue = Number(findedVoucher?.revenue) || 0 - expenses;

      return {
        ...voucher,
        expenses,
        grossRevenue,
      };
    });

    let filterDisplay = '';
    if (dateFilter) {
      const selectedDate = new Date(dateFilter);
      const month = selectedDate.toLocaleString('default', { month: 'long' });
      const year = selectedDate.getFullYear();
      filterDisplay = `<div><strong>Date:</strong> ${month} ${year}</div>`;
    }
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
                font-size: 12px;
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
              .text-left {
                text-align: left;
              }
              .header-class {
                color: #2a5934;
                font-size: 20px;
                font-weight: 700;
                border-bottom: 1px solid #000;
                padding: 5px;
                margin: 10px 0px;
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
            ${filterDisplay ? filterDisplay : ''}
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
                ${sortedAggregatedSummaryData.map(voucher => {
                  return `
                    <tr>
                      <td>${voucher?.date.split("T")[0]}</td>
                      <td>${formatNumber(Number(voucher.revenue)) || 0}</td>
                      <td>${formatNumber(Number(voucher.expense))}</td>
                      <td>${formatNumber(Number(voucher.netIncome)) || 0}</td>
                    </tr>
                  `;
                }).join('')}
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
  


  const totalTripExpense = sortedAggregatedSummaryData.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = sortedAggregatedSummaryData.slice(startIndex, endIndex);

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
        <TripTable data={paginatedTrips} totalData={totalTripExpense} printExpenses={printExpenses} />
      </div>
    </PageContainer>
  );
}
