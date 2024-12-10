// columns.tsx
'use client';
import { FixedTripExpense } from '@/lib/slices/fixed-trip-expense';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import SourceDestination from './SourceDestination';
import SourceStationDestinationStation from './SourceStationDestinationStation';
import BusNumber from './BusNumber';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import Revenue from './Revenue';
import Expense from './Expense';

export const columns: ColumnDef<BusClosingVoucher>[] = [
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
  {
    accessorKey: 'voucherNumber',
    header: 'VoucherNumber',
  },
  {
    id: 'busNumber',
    header: 'Bus Number',
    cell: (
      { row }
    ) => <BusNumber busId={Number(row.original.busId)} />
  },
  {
    id: 'source-destination',
    header: 'Route',
    cell: (
      { row } // Parent component usage
    ) => <SourceDestination routeId={Number(row.original.routeId)} />
  },
  // {
  //   id: 'source-station-destination-station',
  //   header: 'Station',
  //   cell: ({ row }) => (
  //     <SourceStationDestinationStation routeId={row?.original?.routeId || 1} />
  //   )
  // },
  
  {
    id: 'actual-revenue',
    header: 'Revenue',
    cell: (
      { row }
    ) => <Revenue voucherId={Number(row.original.id)} />
  },
  {
    id: 'expense',
    header: 'Expense',
    cell: (
      { row }
    ) => <Expense voucherId={Number(row.original.id)} />
  },
  {
    accessorKey: 'revenue',
    header: 'Gross Revenue'
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
