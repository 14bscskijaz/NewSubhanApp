// columns.tsx
'use client';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { ColumnDef } from '@tanstack/react-table';
import BusNumber from './BusNumber';
import Expense from './Expense';
import Revenue from './Revenue';
import SourceDestination from './SourceDestination';

export const columns: ColumnDef<BusClosingVoucher>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
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
    accessorKey: 'totalTrips',
    header: 'Trips Count'
  },
  {
    accessorKey: 'totalPassengers',
    header: 'Total Passengers'
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Revenue'
  },
  {
    accessorKey: 'freePassengers',
    header: 'Free Passengers'
  },
  {
    accessorKey: 'halfPassengers',
    header: 'Half Passengers'
  },
  {
    accessorKey: 'averagePassengers',
    header: 'Average Passengers'
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
