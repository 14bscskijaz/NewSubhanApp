'use client';
import { BusClosing } from '@/lib/slices/bus-closing';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import SourceDestination from './SourceDestination';
import { TripInformation } from '@/lib/slices/trip-information';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { allRoutes, Route } from '@/lib/slices/route-slices';

export const columns: ColumnDef<TripInformation>[] = [
  {
    id: 'source-station-destination-station',
    header: 'Station',
    cell: ({ row }) => {
      const routes = useSelector<RootState, Route[]>(allRoutes);
      const route = routes.find(
        (route) => route.id === parseInt(row.original.routeId as string)
      );
      const sourceStation = route?.sourceStation ?? 'Unknown';
      const destinationStation = route?.destinationStation ?? 'Unknown';
      return `${sourceStation} - ${destinationStation}`;
    }
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
