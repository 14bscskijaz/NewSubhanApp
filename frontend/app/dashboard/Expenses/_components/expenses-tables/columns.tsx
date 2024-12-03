'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Expense } from '@/lib/slices/expenses-slices';
import { CellAction } from './cell-action';
import BusNumber from './filtersData/BusNumber';
import VoucherNumber from './filtersData/VoucherNumber';
import Revenue from './filtersData/Revenue';

export const columns: ColumnDef<Expense>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => <div>{row.index + 1}</div>
  },
  {
    id: 'busNumber',
    header: 'Bus Number',
    cell: (
      { row } // Parent component usage
    ) => <BusNumber busId={Number(row.original.busId)} />
  },
  {
    id: 'voucherNumber',
    header: 'Voucher Number',
    cell: (
      { row } // Parent component usage
    ) => <VoucherNumber voucherId={Number(row.original.voucherId)} />
  },
  {
    id: 'revenue',
    header: 'Revenue',
    cell: (
      { row } // Parent component usage
    ) => <Revenue voucherId={Number(row.original.voucherId)} />
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
