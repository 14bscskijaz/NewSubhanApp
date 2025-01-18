'use client';
import { formatNumber } from '@/lib/utils/accounting';
import { ColumnDef } from '@tanstack/react-table';
import SerialNo from './SerialNo';
import { format } from 'date-fns';


export const columns: ColumnDef<any>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => <SerialNo rowIndex={row.index} />
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) =>
      row.original.date
        ? row.original.date
        // ? new Date(row.original.date).toISOString().split("T")[0]
        // ? format(new Date(row.original.date), 'dd/MM/yyyy')
        : ''
  },
  // {
  //   id: 'busNumber',
  //   header: 'Bus Number',
  //   cell: (
  //     { row } // Parent component usage
  //   ) => <BusNumber busId={Number(row.original.busId)} />
  // },
  // {
  //   id: 'voucherNumber',
  //   header: 'Voucher Number',
  //   cell: (
  //     { row } // Parent component usage
  //   ) => <VoucherNumber voucherId={Number(row.original.voucherId)} />
  // },
  {
    accessorKey: 'revenue',
    header: 'Gross Revenue',
    cell: (
      { row } // Parent component usage
    ) => <div>{formatNumber(row.original.revenue)}</div>
  },
  {
    accessorKey: 'expense',
    header: 'TotalExpense',
    cell: (
      { row } // Parent component usage
    ) => <div>{formatNumber(row.original.expense)}</div>
  },
  {
    accessorKey: 'netIncome',
    header: 'Net Income',
    cell: (
      { row } // Parent component usage
    ) => <div>{formatNumber(row.original.netIncome)}</div>
  },
  // {
  //   accessorKey: 'description',
  //   header: 'Description'
  // },
  // {
  //   accessorKey: 'amount',
  //   header: 'Amount'
  // },
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];
