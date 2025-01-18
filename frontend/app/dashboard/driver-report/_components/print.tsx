import { toast } from '@/hooks/use-toast';
import { Employee } from '@/lib/slices/employe-slices';
import { formatNumber } from '@/lib/utils/accounting';

export type driverDataT = {
  driver: string;
  busType: string;
  trips: number;
  diesel: number;
}

export const printExpenses = (driverData: driverDataT[], driverFilter: Employee | undefined, dateFilter: string | undefined,routeFilter?:string,busBrandFilter?:string) => {

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

  // Format the date in DD-MM-YYYY format if dateFilter is available
  const formattedDate = dateFilter
    ? new Date(dateFilter).toLocaleDateString('en-GB') // 'en-GB' gives DD-MM-YYYY format
    : '';

  // Only show driver information if a valid driverFilter exists
  const driverInfo = driverFilter 
    ? `<div><strong>Driver</strong>: ${driverFilter.firstName} ${driverFilter.lastName}</div>` 
    : '';

  // Only show date filter information if a valid dateFilter exists
  const dateInfo = formattedDate 
    ? `<div><strong>Date</strong>: ${formattedDate}</div>` 
    : '';
  const routeInfo = routeFilter 
    ? `<div><strong>Route</strong>: ${routeFilter}</div>` 
    : '';
  const busBrandInfo = busBrandFilter 
    ? `<div><strong>Bus Brand</strong>: ${busBrandFilter}</div>` 
    : '';

  // Add padding to the filter section (driverInfo and dateInfo)
  const filters = `${driverInfo}${dateInfo}${routeInfo}${busBrandInfo}`.trim();
  
  const content = `
    <html>
      <head>
        <title>Driver Report - new Subhan (Bus Service)</title>
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

          .filters-section {
            padding: 10px 0; /* Add top and bottom padding */
          }
        </style>
      </head>
      <body>
        <div class="header-class">
          <div>Bus Report</div>
          <div>New Subhan</div>
        </div>
        <div class="filters-section">
          ${filters}
        </div>
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>Bus Type</th>
              <th>Total Trips</th>
              <th>Diesel (Litres)</th>
            </tr>
          </thead>
          <tbody>
            ${driverData
      .map((driver: driverDataT) => `
                <tr>
                  <td>${driver.driver}</td>
                  <td>${driver.busType || ""}</td>
                  <td>${formatNumber(driver.trips)}</td>
                  <td>${formatNumber(driver.diesel) || 0}</td>
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
