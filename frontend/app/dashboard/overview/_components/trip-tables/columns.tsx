// columns.tsx
'use client';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { ColumnDef } from '@tanstack/react-table';
import BusNumber from './BusNumber';
import Expense from './Expense';
import Revenue from './Revenue';
import SourceDestination from './SourceDestination';
import FormatedRevenue from './FormatedRevenue';

export const columns: ColumnDef<BusClosingVoucher>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => <div className='!max-w-5'>{row.index + 1}</div>
  },

  // {
  //   accessorKey: 'date',
  //   header: 'Date',
  //   cell: ({ row }) =>
  //     row.original.date
  //       ? new Date(row.original.date).toISOString().split("T")[0]
  //       : ''
  // },
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
  {
    accessorKey: 'dieselLitres',
    header: 'Diesel (Litres)'
  },
  {
    id: 'actual-revenue',
    header: 'Revenue',
    cell: (
      { row }
    ) => <Revenue voucherId={Number(row.original.id)} />
  },
  
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
