'use client';
import { TripInformation } from '@/lib/slices/trip-information';
import { ColumnDef } from '@tanstack/react-table';
import SourceDestination from './SourceDestination';
import { CellAction } from './cell-action';

export const columns: ColumnDef<TripInformation>[] = [
  {
    id: 'source-station-destination-station',
    header: 'Station',
    cell: ({ row }) => (
      <SourceDestination routeId={row.original.routeId?.toString()} />
    )
  },
  {
    accessorKey: 'passengerCount',
    header: 'Passengers'
  },
  {
    accessorKey: 'actualRevenue',
    header: 'Revenue'
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
