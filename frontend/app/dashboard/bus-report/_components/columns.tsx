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
    accessorKey: 'tripsCount',
    header: 'Trips Count',
  },
  {
    header: 'Passengers',
    cell:({row})=>`${formatNumber(row.original.passengers)}`
  },
  {
    header: 'Expenses',
    cell:({row})=>`${formatNumber(row.original.expenses)}`
  },
  {
    header: 'Revenue',
    cell:({row})=>`${formatNumber(row.original.revenue)}`
  },
];
