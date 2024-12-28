'use client';
import { TripInformationInput } from '@/lib/slices/trip-information';
import { ColumnDef } from '@tanstack/react-table';
import SourceDestinationStation from './SourceDestinationStation';

export const StationsColumn: ColumnDef<TripInformationInput & {routeIds:[number]}>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },
  {
    id: 'source-destination',
    header: 'Stations',
    cell: (
      { row } 
    ) => <SourceDestinationStation routeId={Number(row.original.routeIds[0])} />
  },
  
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
];
