// columns.tsx
'use client';
import { BusReport } from '@/lib/slices/Report/bus-report-slice';
import { ColumnDef } from '@tanstack/react-table';
import { formatNumber } from 'accounting';

export const columns: ColumnDef<any>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: 'busNumber',
    header: 'Bus Number'
  },
  {
    accessorKey: 'busOwner',
    header: 'Bus Owner'
  },
  {
    accessorKey: 'totalTrips',
    header: 'Trips Count'
  },
  {
    accessorKey: 'totalPassengers',
    header: 'Passengers',
    cell:({row})=>`${formatNumber(row.original.totalPassengers)}`
  },
  {
    accessorKey: 'totalExpenses',
    header: 'Expenses',
    cell:({row})=>`${formatNumber(row.original.totalExpenses)}`
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Revenue',
    cell:({row})=>`${formatNumber(row.original.totalRevenue)}`
  },
];
