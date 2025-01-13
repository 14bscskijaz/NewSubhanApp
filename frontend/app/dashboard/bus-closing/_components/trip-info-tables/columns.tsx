'use client';
import { TripInformation } from '@/lib/slices/trip-information';
import { ColumnDef } from '@tanstack/react-table';
import SourceDestination from './SourceDestination';
import { CellAction } from './cell-action';
import { formatNumber } from 'accounting';

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
    header: 'Passengers (Free Tickets)',
    cell:({row})=><div>{`${row.original.passengerCount} (${row.original.freeTicketCount})`}</div>
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue',
    cell: ({ row }) => <div>{formatNumber(Number(row.original.revenue))}</div>
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
