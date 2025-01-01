// columns.tsx
'use client';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { ColumnDef } from '@tanstack/react-table';
import BusNumber from './BusNumber';
import Expenses from './Expense';
import NetIncome from './Revenue';
import SourceDestination from './SourceDestination';
import FormatedRevenue from './FormatedRevenue';
import Revenue from '@/app/dashboard/view-daily-expense/_components/trip-tables/filtersData/Revenue';
import { Expense } from '@/lib/slices/saved-expenses';

export const columns: ColumnDef<Expense>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
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
  //   accessorKey: 'voucherNumber',
  //   header: 'VoucherNumber',
  // },
  // {
  //   id: 'busNumber',
  //   header: 'Bus Number',
  //   cell: (
  //     { row }
  //   ) => <BusNumber busId={Number(row.original.busId)} />
  // },
  // {
  //   id: 'source-destination',
  //   header: 'Route',
  //   cell: (
  //     { row } // Parent component usage
  //   ) => <SourceDestination routeId={Number(row.original.routeId)} />
  // },
  // {
  //   id: 'source-station-destination-station',
  //   header: 'Station',
  //   cell: ({ row }) => (
  //     <SourceStationDestinationStation routeId={row?.original?.routeId || 1} />
  //   )
  // },
  {
    id: 'revenue',
    header: 'Gross Revenue',
    cell: (
      { row } // Parent component usage
    ) => <Revenue voucherId={Number(row.original.busClosingVoucherId)} />
  },
  {
    id: 'expense',
    header: 'Expense',
    cell: (
      { row }
    ) => <Expenses voucherId={Number(row.original.busClosingVoucherId)} amount={row.original.amount} />
  },
  {
    id: 'actual-revenue',
    header: 'Net Income',
    cell: (
      { row }
    ) => <NetIncome voucherId={Number(row.original.busClosingVoucherId)} amount={row.original.amount} />
  },
  // {
  //   accessorKey: 'dcParchi',
  //   header: 'DC Parchi (Fsd Only)'
  // },
  // {
  //   accessorKey: 'refreshment',
  //   header: 'Refreshment'
  // },
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];
