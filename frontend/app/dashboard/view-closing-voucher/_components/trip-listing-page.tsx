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
import { log } from 'node:console';

type TTripListingPage = {};

export default function TripListingPage({ }: TTripListingPage) {
  const { formatNumber } = useAccounting();

  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers);
  const SavedTripInformation = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const buses = useSelector<RootState, Buses[]>(allBuses);
  // const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [busNumber, setSetBusNumber] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [pageLimit, setPageLimit] = useState(10);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const fetchFixedTripExpense = async () => {
    try {
      const [busClosingExpense, routeData, busData, tickets] = await Promise.all([
        getAllBusClosingVouchers(),
        getAllRoutes(),
        getAllBuses(),
        getAllTicketPrices(),
      ]);

      dispatch(setBusClosingVoucher(busClosingExpense));
      dispatch(setRoute(routeData));
      dispatch(setBus(busData));
      dispatch(setTicketRaw(tickets));
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000,
      });
    }
  };


  useEffect(() => {
    fetchFixedTripExpense();
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const busNumberParam = searchParams.get('busNumber') || '';
    const dateParam = searchParams.get('date') || '';
    const routeParam = searchParams.get('route') || '';
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSetBusNumber(busNumberParam);
    setDateFilter(dateParam);
    setRouteFilter(routeParam);
    setPageLimit(Number(limitParam));

  }, [searchParams, dispatch]);

  const handleCalculateExpenses = (voucher: any) => {
    // Sum all expenses, ensuring proper field names and valid numeric conversions
    const allExpenses = [
      voucher?.alliedmor,
      voucher?.cityParchi,
      voucher?.cleaning,
      voucher?.cOilTechnician,
      voucher?.commission,
      voucher?.diesel,
      voucher?.refreshment,
      voucher?.toll,
      voucher?.generator,
      voucher?.repair,
      voucher?.miscellaneousExpense,
    ]
      .map(Number) // Convert all values to numbers
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    return allExpenses;
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    let startDate = 0;
    let endDate = 0;

    if (dateFilter.includes('|')) {
      const [start, end] = dateFilter.split('|');
      startDate = new Date(start).setHours(0, 0, 0, 0);
      endDate = new Date(end).setHours(23, 59, 59, 999);
    }

    const voucherDate = voucher.date ? new Date(voucher.date).getTime() : 0;
    const route = routes.find((r) => r.id === voucher.routeId);
    const busData = buses.find(
      (bus) => bus.id.toString().trim() === voucher.busId.toString().trim()
    );

    const totalExpenseValue = handleCalculateExpenses(voucher);
    const allRevenue = totalExpenseValue + Number(voucher.revenue);
    const matchesSearch = search
      ? voucher.voucherNumber?.toString().toLowerCase().includes(search.toLowerCase()) ||
      totalExpenseValue?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.revenue?.toString().toLowerCase().includes(search.toLowerCase()) ||
      allRevenue?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.date?.toString().toLowerCase().includes(search.toLowerCase()) ||
      route?.sourceCity.toLowerCase().includes(search.toLowerCase()) ||
      route?.destinationCity.toLowerCase().includes(search.toLowerCase()) ||
      route?.sourceAdda.toLowerCase().includes(search.toLowerCase()) ||
      route?.destinationAdda.toLowerCase().includes(search.toLowerCase()) ||
      busData?.busNumber.toLowerCase().includes(search.toLowerCase())
      : true;

    const routeData = routes.find(
      (route) => route.id.toString().trim() === voucher.routeId?.toString().trim()
    );

    const routeToBeFilter = routeData
      ? `${routeData.sourceCity.trim()}-${routeData.destinationCity.trim()}`
      : '';

    const matchesBusNumber = busNumber
      ? busData?.busNumber?.toString().trim().toLowerCase() === busNumber.toLowerCase()
      : true;

    const matchesRouteFilter = routeFilter
      ? routeToBeFilter.toLowerCase() === routeFilter.toLowerCase()
      : true;

    const matchesDateRange = startDate && endDate
      ? voucherDate >= startDate && voucherDate <= endDate
      : true;

    return matchesSearch && matchesBusNumber && matchesRouteFilter && matchesDateRange;
  });

  // Sort vouchers by date in descending order (latest first)
  const sortedVouchers = [...filteredVouchers].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });




  const totalExpense = sortedVouchers.reduce((acc: any, item: any) => {
    const expenses = [
      item.alliedmor,
      item.cityParchi,
      item.cleaning,
      item.cOilTechnician,
      item.commission,
      item.diesel,
      item.refreshment,
      item.toll,
      item?.generator,
      item?.repair,
      item?.miscellaneousExpense,
    ]
      .map(Number)
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

    return acc + expenses; // Accumulate the total expense
  }, 0)

  const totalRevenue = sortedVouchers.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0) + totalExpense;



  const printExpenses = () => {
    // Create Maps for quick lookups
    const BusNumberMap = new Map(buses.map(({ id, busNumber }) => [id, busNumber]));
    const RouteMap = new Map(
      routes.map(({ id, sourceAdda, destinationAdda, destinationCity, sourceCity }) => [
        id,
        { sourceAdda, sourceCity, destinationAdda, destinationCity },
      ])
    );

    // Prepare the data for printing
    const voucherData = sortedVouchers.map((voucher) => {
      const route: any = RouteMap.get(voucher.routeId || 0) || {};
      const busNumber = BusNumberMap.get(Number(voucher?.busId) || 0) || 'N/A';
      const expenses = handleCalculateExpenses(voucher);
      const grossRevenue = Number(voucher.revenue) || 0 - expenses;

      return {
        ...voucher,
        route: route.sourceCity && route.destinationCity
          ? `${route.sourceCity} - ${route.destinationCity}`
          : 'N/A',
        busNumber,
        expenses,
        grossRevenue,
      };
    });

    // Helper function to format ISO date strings to DD-MM-YYYY
    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const filtrs = dateFilter.split('|')
    // Format the date range if provided
    const formattedDateRange = filtrs && filtrs.length === 2
      ? `${formatDate(filtrs[0])} to ${formatDate(filtrs[1])}`
      : 'No date range applied';

    const filterDetails = `
      <div style="margin-bottom: 20px;">
        <ul style="list-style: none; padding: 0;">
          ${formattedDateRange ? `<li><strong>Date Range:</strong> ${formattedDateRange}</li>` : ''}
          ${busNumber ? `<li><strong>Bus Number:</strong> ${busNumber}</li>` : ''}
          ${routeFilter ? `<li><strong>Route:</strong> ${routeFilter}</li>` : ''}
        </ul>
      </div>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Expenses Report - New Subhan (Bus Service)</title>
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
              <div>Bus Closing Voucher</div>
              <div>New Subhan</div>
            </div>
            ${filterDetails}
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Voucher Number</th>
                  <th>Bus Number</th>
                  <th>Route</th>
                  <th>Revenue</th>
                  <th>Expense</th>
                  <th>Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${voucherData
          .map(voucher => {
            return `
                    <tr>
                      <td>${voucher?.date.split("T")[0]}</td>
                      <td>${voucher.voucherNumber || 'N/A'}</td>
                      <td>${voucher.busNumber}</td>
                      <td>${voucher.route}</td>
                      <td>${formatNumber(Number(voucher.revenue)) || 0}</td>
                      <td>${formatNumber(voucher.expenses)}</td>
                      <td>${formatNumber(voucher.grossRevenue) || 0}</td>
                    </tr>
                  `;
          })
          .join('')}
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="4" class="text-left">Total</th>
                  <td>${formatNumber(Number(totalRevenue))}</td>
                  <td>${formatNumber(Number(totalExpense))}</td>
                  <td>${formatNumber(Number(totalRevenue) - Number(totalExpense))}</td>
                </tr>
              </tfoot>
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




  const totalTripExpense = sortedVouchers.length;
  // Reverse the filteredRoutes array
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = sortedVouchers.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Bus Closings (${totalTripExpense})`}
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
