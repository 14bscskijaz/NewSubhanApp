'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Expense } from '@/lib/slices/expenses-slices';
import { CellAction } from './cell-action';
import BusNumber from './filtersData/BusNumber';
import VoucherNumber from './filtersData/VoucherNumber';
import Revenue from './filtersData/Revenue';
import Routes from './filtersData/Route';
import SerialNo from './SerialNo';
import Expenses from '@/app/dashboard/view-closing-voucher/_components/trip-tables/Expense';
import NetIncome from '../NetIncome';


export const columns: ColumnDef<Expense>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => <SerialNo rowIndex = {row.index}/>
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) =>
      row.original.date
        ? new Date(row.original.date).toISOString().split("T")[0]
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
    id: 'revenue',
    header: 'Gross Revenue',
    cell: (
      { row } // Parent component usage
    ) => <Revenue voucherId={Number(row.original.voucherId)} />
  },
  {
    id: 'expense',
    header: 'TotalExpense',
    cell: (
      { row }
    ) => <Expenses voucherId={Number(row.original.id)} />
  },
  {
    id: 'net-income',
    header: 'Net Income',
    cell: (
      { row } // Parent component usage
    ) => <NetIncome voucherId={Number(row.original.id)} />
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
