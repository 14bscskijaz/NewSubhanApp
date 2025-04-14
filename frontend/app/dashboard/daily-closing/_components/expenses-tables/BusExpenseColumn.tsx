'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Expense } from '@/lib/slices/expenses-slices';
import { CellAction } from './cell-action';
import BusNumber from './filtersData/BusNumber';
import VoucherNumber from './filtersData/VoucherNumber';
import Revenue from './filtersData/Revenue';
import Routes from './filtersData/Route';
import SerialNo from './SerialNo';

export const BusExpensecolumns: ColumnDef<Expense>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => <SerialNo rowIndex={row.index} />
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
      { row } 
    ) => <VoucherNumber voucherId={Number(row.original.busClosingVoucherId)} />
  },
  {
    id: 'revenue',
    header: 'Revenue',
    cell: (
      { row } 
    ) => <Revenue voucherId={Number(row.original.busClosingVoucherId)} />
  },
  {
    id: 'route',
    header: 'Route',
    cell: (
      { row } // Parent component usage
    ) => <Routes routeId={Number(row.original.busClosingVoucherId)} />
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
