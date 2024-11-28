// columns.tsx
'use client';
import { Trip } from '@/lib/slices/fixed-trip-expense';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import SourceDestination from './SourceDestination';
import SourceStationDestinationStation from './SourceStationDestinationStation';

export const columns: ColumnDef<Trip>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },
  // {
  //   accessorKey: 'routeId',
  //   header: 'Route ID',
  // },
  {
    id: 'source-destination',
    header: 'Route',
    cell: (
      { row } // Parent component usage
    ) => <SourceDestination routeId={Number(row.original.routeId)} />
  },
  {
    id: 'source-station-destination-station',
    header: 'Station',
    cell: ({ row }) => (
      <SourceStationDestinationStation routeId={row.original.routeId} />
    )
  },
  {
    accessorKey: 'routeCommission',
    header: 'Route Commission'
  },
  {
    accessorKey: 'rewardCommission',
    header: 'Reward Commission'
  },
  {
    accessorKey: 'steward',
    header: 'Steward'
  },
  {
    accessorKey: 'counter',
    header: 'Counter (Salary)'
  },
  {
    accessorKey: 'dcParchi',
    header: 'DC Parchi (Fsd Only)'
  },
  {
    accessorKey: 'refreshment',
    header: 'Refreshment'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
