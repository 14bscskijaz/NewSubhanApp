'use client';
import { Route } from '@/lib/slices/route-slices';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Route>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'sourceCity',
    header: 'Source',
  },
  {
    accessorKey: 'sourceAdda',
    header: 'Source Station',
  },
  {
    accessorKey: 'destinationCity',
    header: 'Destination',
  },
  {
    accessorKey: 'destinationAdda',
    header: 'Destination Station',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
