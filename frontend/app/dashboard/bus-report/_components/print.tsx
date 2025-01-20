import { RouteMetric } from '@/types/trip';
import { Route } from '@/lib/slices/route-slices';
import { toast } from '@/hooks/use-toast';
import { RouteDetails, VoucherPrintData } from '@/types/trip';
import { Buses } from '@/lib/slices/bus-slices';
import useAccounting from '@/hooks/useAccounting';
import { formatNumber } from '@/lib/utils/accounting';


export const printExpenses = (
  busData: any,
  buses: Buses[],
  filters: { dateRange?: string[]; busNumber?: string; busOwner?: string }
) => {
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

  const { dateRange, busNumber, busOwner } = filters;

  // Helper function to format ISO date strings to DD-MM-YYYY
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format the date range if provided
  const formattedDateRange = dateRange
    ? `${formatDate(dateRange[0])} to ${formatDate(dateRange[1])}`
    : '';

    const filterDetails = `
    <div style="margin-bottom: 20px;">
      <ul style="list-style: none; padding: 0;">
        ${
          formattedDateRange && 
          typeof formattedDateRange === 'string' && 
          formattedDateRange.trim() !== ''
            ? `<li><strong>Date Range:</strong> ${formattedDateRange}</li>` 
            : ''
        }
        ${busNumber ? `<li><strong>Bus Number:</strong> ${busNumber}</li>` : ''}
        ${busOwner ? `<li><strong>Bus Owner:</strong> ${busOwner}</li>` : ''}
      </ul>
    </div>
  `;
  
  

  const content = `
  <html>
    <head>
      <title>Bus Report - New Subhan (Bus Service)</title>
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
        <div>Bus Report</div>
        <div>New Subhan</div>
      </div>
      ${filterDetails}
      <table>
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Bus Owner</th>
            <th>Total Trips</th>
            <th>Total Passengers</th>
            <th>Total Revenue</th>
            <th>Total Expenses</th>
          </tr>
        </thead>
        <tbody>
          ${busData
      .map((bus: any) => `
              <tr>
                <td>${bus.busNumber}</td>
                <td>${bus.busOwner || 'N/A'}</td>
                <td>${formatNumber(bus.totalTrips)}</td>
                <td>${formatNumber(bus.totalPassengers) || 0}</td>
                <td>${formatNumber(bus.totalRevenue) || 0}</td>
                <td>${formatNumber(bus.totalExpenses) || 0}</td>
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



