'use client'
import { RouteMetric, SearchFilters } from '@/types/trip';
import { Route } from '@/lib/slices/route-slices';
import { toast } from '@/hooks/use-toast';
import { RouteDetails, VoucherPrintData } from '@/types/trip';
import { formatNumber } from './accounting';

const isRouteDetails = (route: RouteDetails | 0): route is RouteDetails => {
  return route !== 0 && 'sourceCity' in route && 'destinationCity' in route;
};

// Function to format date to DD_MM_YYYY
const formatDate = (date: string) => {
  const newDate = new Date(date);
  if (isNaN(newDate.getTime())) return ''; // Invalid date, return empty string

  const dd = newDate.getDate().toString().padStart(2, '0');
  const mm = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const yyyy = newDate.getFullYear();

  return `${dd}-${mm}-${yyyy}`; // Use DD-MM-YYYY format
};


export const printExpenses = (filteredVouchers: RouteMetric[], routes: Route[], isCity: boolean, filters: SearchFilters) => {
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

  // Function to render the filter information in the print layout
  const filtersSection = (filters: SearchFilters) => {
    let filterContent = '';
  
    if (filters.search) {
      filterContent += `<p><strong>Search Term:</strong> ${filters.search}</p>`;
    }
  
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange.split('|'); // Assuming the date range is in ISO format separated by '|'
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
  
      if (formattedStartDate && formattedEndDate) {
        filterContent += `<p><strong>Date Range:</strong> ${formattedStartDate} to ${formattedEndDate}</p>`;
      } else {
        filterContent += `<p><strong>Date Range:</strong> Invalid Date</p>`;
      }
    }
  
    if (filters.route) {
      filterContent += `<p><strong>Route:</strong> ${filters.route}</p>`;
    }
  
    return filterContent;
  };
  

  const content = `
    <html>
      <head>
        <title>Bus Report - new Subhan (Bus Service)</title>
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
          <div>Route Report</div>
          <div>New Subhan</div>
        </div>
        ${filtersSection(filters)}
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
