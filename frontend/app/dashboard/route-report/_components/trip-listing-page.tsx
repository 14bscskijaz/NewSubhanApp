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
import { SavedTripInformation, allSavedsavedTripsInformation, setSavedTripInformation } from '@/lib/slices/trip-information-saved';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripTable from './trip-tables';
import NewTripDialog from '../../trip-expense/_components/new-trip-dialogue';
import { getAllTrips } from '@/app/actions/trip.action';
import { TripInformation, allTripsInformation, setTripInformation } from '@/lib/slices/trip-information';

type TTripListingPage = {};

export default function TripListingPage({ }: TTripListingPage) {
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
      const fetchBusClosingExpense = await getAllTrips();
      const routes = await getAllRoutes();
      const buses = await getAllBuses();

      dispatch(setSavedTripInformation(fetchBusClosingExpense));
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

  const calculateMetricsByRoute = () => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Parse start and end dates for comparison
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    const routeMap = new Map<string, any>();

    // Filter trips within the date range
    const filteredTrips = SavedTripInformation.filter((trip) => {
      const tripDate = trip.date ? new Date(trip.date) : null;

      // Include trips only within the date range
      if (tripDate) {
        if (parsedStartDate && parsedEndDate) {
          return tripDate >= parsedStartDate && tripDate <= parsedEndDate;
        } else if (parsedStartDate) {
          return tripDate >= parsedStartDate;
        } else if (parsedEndDate) {
          return tripDate <= parsedEndDate;
        }
      }

      return true; // Include all trips if no date filter is applied
    });

    // Aggregate data by route
    filteredTrips.forEach((trip) => {
      const routeId = trip.routeId || "Unknown";
      if (!routeMap.has(routeId)) {
        routeMap.set(routeId, {
          routeId,
          totalTrips: 0,
          totalPassengers: 0,
          totalRevenue: 0,
          freePassengers: 0,
          halfPassengers: 0,
          fullPassengers: 0,
        });
      }

      const routeData = routeMap.get(routeId);
      routeData.totalTrips += 1;
      routeData.totalPassengers += parseInt(trip.passengerCount) || 0;
      routeData.totalRevenue += parseFloat(trip.revenue) || 0;
      routeData.freePassengers += parseInt(trip.freeTicketCount) || 0;
      routeData.halfPassengers += parseInt(trip.halfTicketCount) || 0;
      routeData.fullPassengers += parseInt(trip.fullTicketCount) || 0;

      routeMap.set(routeId, routeData);
    });

    // Calculate averages and map route names
    const result = Array.from(routeMap.values()).map((data) => {
      const route = routes.find((r) => r.id.toString() === data.routeId);

      return {
        routeId: data.routeId,
        totalTrips: data.totalTrips,
        totalPassengers: data.totalPassengers,
        totalRevenue: data.totalRevenue.toFixed(2),
        freePassengers: data.freePassengers,
        halfPassengers: data.halfPassengers,
        fullPassengers: data.fullPassengers,
        averagePassengers: data.totalTrips
          ? Math.floor(data.totalPassengers / data.totalTrips)
          : 0,
      };
    });

    return result;
  };


  const routeMetrics = calculateMetricsByRoute();


  const filteredVouchers = routeMetrics.filter((voucher) => {
    // Match search filter
    const matchesSearch = search
      ? voucher.averagePassengers?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.freePassengers?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.fullPassengers?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.totalPassengers?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.totalRevenue?.toString().toLowerCase().includes(search.toLowerCase()) ||
      voucher.totalTrips?.toString().toLowerCase().includes(search.toLowerCase())
      : true;

    const routeData = routes.find(
      (route) => route.id.toString().trim() === voucher.routeId?.toString().trim()
    );

    // Create route key for filtering
    const routeToBeFilter = routeData
      ? `${routeData.sourceCity.trim()}-${routeData.destinationCity.trim()}`
      : '';

    // // Normalize voucher date to remove the time part for comparison
    // const voucherDate = voucher.date ? new Date(voucher.date).setHours(0, 0, 0, 0) : 0;

    // // Normalize filter date to remove the time part for comparison
    // const dateToBeFilter = dateFilter ? new Date(dateFilter).setHours(0, 0, 0, 0) : 0;



    // Match route filter
    const matchesRouteFilter = routeFilter
      ? routeToBeFilter.toLowerCase() === routeFilter.toLowerCase()
      : true;

    // Match date filter
    // const matchesDateFilter = dateFilter
    //   ? voucherDate === dateToBeFilter
    //   : true;

    // Return combined match result
    return matchesSearch && matchesRouteFilter;
  });


  const totalRevenue = filteredVouchers.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0);

  const printExpenses = () => {
    // Create Maps for quick lookups
    const RouteMap = new Map(
      routes.map(({ id, sourceAdda, destinationAdda, destinationCity, sourceCity }) => [
        id,
        { sourceAdda, sourceCity, destinationAdda, destinationCity },
      ])
    );

    // Prepare the data for printing
    const voucherData = filteredVouchers.map((voucher) => {
      const route: any = RouteMap.get(voucher.routeId || 0) || {};

      return {
        ...voucher,
        route: route.sourceCity && route.destinationCity
          ? `${route.sourceCity} - ${route.destinationCity}`
          : 'N/A'
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
                        <td>${voucher.route}</td>
                        <td>${voucher.totalTrips}</td>
                        <td>${voucher.totalRevenue || 0}</td>
                        <td>${voucher.totalPassengers}</td>
                        <td>${voucher.halfPassengers || 0}</td>
                        <td>${voucher.freePassengers || 0}</td>
                        <td>${voucher.averagePassengers || 0}</td>
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
            title={`Route Report (${totalTripExpense})`}
            description=""
          />
          {/* <NewTripDialog /> */}
        </div>
        <Separator />
        <TripTable data={paginatedTrips} totalData={totalTripExpense} totalRevenue={totalRevenue}
          printExpenses={printExpenses}
        />
      </div>
    </PageContainer>
  );
}
