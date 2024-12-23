'use client'
import { RouteMetric } from '@/types/trip';
import { Route } from '@/lib/slices/route-slices';
import { toast } from '@/hooks/use-toast';
import { RouteDetails, VoucherPrintData } from '@/types/trip';
import { formatNumber } from './accounting';

const isRouteDetails = (route: RouteDetails | 0): route is RouteDetails => {
  return route !== 0 && 'sourceCity' in route && 'destinationCity' in route;
};

export const printExpenses = (filteredVouchers: RouteMetric[], routes: Route[], isCity: boolean) => {
  // Create a Map with proper typing
  const RouteMap = new Map<number | string, RouteDetails>(
    routes.map(({ id, sourceAdda, destinationAdda, destinationCity, sourceCity }) => [
      id,
      { id, sourceAdda, sourceCity, destinationAdda, destinationCity },
    ])
  );

  const voucherData: VoucherPrintData[] = filteredVouchers.map((voucher) => {
    const routeId = voucher?.routeIds[0];
    const route = RouteMap.get(typeof routeId === 'number' ? routeId : 0) ?? 0;

    return {
      ...voucher,
      route: isRouteDetails(route)
        ? `${isCity ? `${route.sourceCity} - ${route.destinationCity}` : `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`}`
        : 'N/A'
    };
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast({
      title: 'Error',
      description: 'Unable to open print window. Please check your browser settings.',
      variant: 'destructive',
      duration: 1500,
    });
    return;
  }

  const content = `
    <html>
      <head>
        <title>Route Report</title>
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
          tfoot th {
            background-color: #2a5934;
            color: #2a5934;
          }
          tfoot td {
            font-weight: bold;
            background-color: #d0e8d2;
          }
          .text-left {
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1>Route Report</h1>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Total Trips</th>
              <th>Total Revenue</th>
              <th>Total Passengers</th>
              <th>Half Passengers</th>
              <th>Free Passengers</th>
              <th>Average Passengers</th>
            </tr>
          </thead>
          <tbody>
            ${voucherData
              .map(voucher => `
                <tr>
                  <td>${voucher.route}</td>
                  <td>${formatNumber(voucher.totalTrips)}</td>
                  <td>${formatNumber(voucher.totalRevenue) || 0}</td>
                  <td>${formatNumber(voucher.totalPassengers)}</td>
                  <td>${formatNumber(voucher.halfPassengers) || 0}</td>
                  <td>${formatNumber(voucher.freePassengers) || 0}</td>
                  <td>${formatNumber(voucher.averagePassengers) || 0}</td>
                </tr>
              `)
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
};