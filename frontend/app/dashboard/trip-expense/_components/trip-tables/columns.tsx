// columns.tsx
'use client';
import { FixedTripExpense } from '@/lib/slices/fixed-trip-expense';
import { ColumnDef } from '@tanstack/react-table';
import StandCommission from './DriverCommission';
import SourceDestination from './SourceDestination';
import SourceStationDestinationStation from './SourceStationDestinationStation';
import { CellAction } from './cell-action';

export const columns: ColumnDef<FixedTripExpense>[] = [
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
  // {
  //   accessorKey: 'routeCommission',
  //   header: 'Stand Commission'
  // },
  {
    accessorKey: 'rewardCommission',
    header: 'Reward Commission'
  },
  {
    id: 'routeCommission',
    header: 'Stand Commission',
    cell: ({ row }) => (
      <StandCommission standCommission={row.original.routeCommission} />
    )
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
