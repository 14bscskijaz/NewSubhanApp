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
    accessorKey: 'date',
    header: 'Date'
  },
  {
    accessorKey: 'firstVoucherNumber',
    header: 'Voucher Number'
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Revenue'
  },
  {
    accessorKey: 'totalBusExpense',
    header: 'Expenses'
  },
  {
    accessorKey: 'netBusRevenue',
    header: 'Net Revenue',
    cell:({row})=>`${formatNumber(row.original.netBusRevenue)}`
  },
];
