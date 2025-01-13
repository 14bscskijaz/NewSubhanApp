// columns.tsx
'use client';
import { BusReport } from '@/lib/slices/Report/bus-report-slice';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<BusReport>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: 'driver',
    header: 'Driver'
  },
  {
    accessorKey: 'busType',
    header: 'Bus Type'
  },
  {
    accessorKey: 'trips',
    header: 'Trips Count'
  },
  {
    accessorKey: 'diesel',
    header: 'Diesel'
  },
  // {
  //   accessorKey: 'totalExpenses',
  //   header: 'Expenses'
  // },
  // {
  //   accessorKey: 'totalRevenue',
  //   header: 'Revenue'
  // },
];
