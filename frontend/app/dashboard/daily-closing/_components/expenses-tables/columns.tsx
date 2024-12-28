'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Expense } from '@/lib/slices/expenses-slices';
import { CellAction } from './cell-action';
import BusNumber from './filtersData/BusNumber';
import VoucherNumber from './filtersData/VoucherNumber';
import Revenue from './filtersData/Revenue';
import Routes from './filtersData/Route';
import SerialNo from './SerialNo';
import FormattedAmount from './FormattedAmount';

export const columns: ColumnDef<Expense>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => <SerialNo rowIndex = {row.index}/>
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
  // {
  //   id: 'revenue',
  //   header: 'Revenue',
  //   cell: (
  //     { row } // Parent component usage
  //   ) => <Revenue voucherId={Number(row.original.voucherId)} />
  // },
  // {
  //   id: 'route',
  //   header: 'Route',
  //   cell: (
  //     { row } // Parent component usage
  //   ) => <Routes routeId={Number(row.original.routeId)} />
  // },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    id:"amount",
    accessorKey: 'amount',
    header: 'Amount',
    cell:(
      {row}
    )=><FormattedAmount amount={row.original.amount}/>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
