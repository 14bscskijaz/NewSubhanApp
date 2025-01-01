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
  const [pageLimit, setPageLimit] = useState(20);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const fetchFixedTripExpense = async () => {
    try {
      const fetchBusClosingExpense = await getAllBusClosingVouchers();
      const routes = await getAllRoutes();
      const buses = await getAllBuses();

      dispatch(setBusClosingVoucher(fetchBusClosingExpense));
      dispatch(setRoute(routes));
      dispatch(setBus(buses));
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
    const busNumberParam = searchParams.get('busNumber') || '';
    const dateParam = searchParams.get('date') || '';
    const routeParam = searchParams.get('route') || '';
    const limitParam = searchParams.get('limit') || '20';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSetBusNumber(busNumberParam);
    setDateFilter(dateParam);
    setRouteFilter(routeParam);
    setPageLimit(Number(limitParam));
  }, [searchParams, dispatch]);

  const filteredVouchers = vouchers.filter((voucher) => {
    // Default to today's date if no dateFilter is provided
    let selectedDate = 0;
  
    // Check if the dateFilter is provided, otherwise use today's date
    if (dateFilter) {
      selectedDate = new Date(dateFilter).setHours(0, 0, 0, 0); // Normalize the selected date to start of the day
    } else {
      selectedDate = new Date().setHours(0, 0, 0, 0); // Default to today's date
    }
  
    // Normalize voucher date to remove the time part for comparison
    const voucherDate = voucher.date ? new Date(voucher.date).getTime() : 0;
  
    // Match search filter
    const matchesSearch = search
      ? voucher.alliedmor?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.cityParchi?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.cleaning?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.coilTechnician?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.date?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.dieselLitres?.toString().toLowerCase().includes(search.toLowerCase())
      : true;
  
    // Find corresponding bus and route data
    const busData = buses.find(
      (bus) => bus.id.toString().trim() === voucher.busId.toString().trim()
    );
    const routeData = routes.find(
      (route) => route.id.toString().trim() === voucher.routeId?.toString().trim()
    );
  
    // Create route key for filtering
    const routeToBeFilter = routeData
      ? `${routeData.sourceCity.trim()}-${routeData.destinationCity.trim()}`
      : '';
  
    // Match busNumber filter
    const matchesBusNumber = busNumber
      ? busData?.busNumber?.toString().trim().toLowerCase() === busNumber.toLowerCase()
      : true;
  
    // Match route filter
    const matchesRouteFilter = routeFilter
      ? routeToBeFilter.toLowerCase() === routeFilter.toLowerCase()
      : true;
  
    // Match single date filter (selectedDate)
    const matchesDate = selectedDate
      ? voucherDate >= selectedDate && voucherDate < selectedDate + 86400000 // Check if the voucher's date is the same as the selected date
      : true;
  
    // Return combined match result
    return matchesSearch && matchesBusNumber && matchesRouteFilter && matchesDate;
  });
  
  



  const totalRevenue = filteredVouchers.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0);
  const totalExpense = filteredVouchers.reduce((acc: any, item: any) => {
    const expenses = [
      item.alliedmor,
      item.cityParchi,
      item.cleaning,
      item.coilTechnician,
      item.commission,
      item.diesel,
      item.dieselLitres,
      item.refreshment,
      item.toll,
    ]
      .map(Number) // Convert all values to numbers
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0); // Sum the values, treating NaN as 0

    return acc + expenses; // Accumulate the total expense
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
      voucher?.dieselLitres,
      voucher?.refreshment,
      voucher?.toll,
    ]
      .map(Number) // Convert all values to numbers
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    return allExpenses;
  };

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
    const voucherData = filteredVouchers.map((voucher) => {
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
        grossRevenue
      };
    });

    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <html>
          <head>
            <title>Expenses Report</title>
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
            </style>
          </head>
          <body>
            <h1>Bus Closing Voucher</h1>
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


  const totalTripExpense = filteredVouchers.length;
  // Reverse the filteredRoutes array
  const sortedRoutes = filteredVouchers.sort((a, b) => {
    // Replace with appropriate comparison logic, e.g., if you're sorting numbers or strings
    return b.id - a.id; // For numerical sorting
    // or
    // return b.someProperty.localeCompare(a.someProperty); // For string sorting
  });
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = sortedRoutes.slice(startIndex, endIndex);

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
