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
    accessorKey: 'busNumber',
    header: 'Bus Number'
  },
  {
    accessorKey: 'passengersMonthWise',
    header: 'Passengers'
  },
  {
    accessorKey: 'revenue',
    header: 'Gross Revenue'
  }
];
