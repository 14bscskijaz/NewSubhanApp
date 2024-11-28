'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { ExpandableText } from './expand-text';
import { StatusBadge } from './status-badge';
import { Route } from '@/lib/slices/route-slices';

export const columns: ColumnDef<Route>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'source',
    header: 'Source',
  },
  {
    accessorKey: 'sourceStation',
    header: 'Source Station',
  },
  {
    accessorKey: 'destination',
    header: 'Destination',
  },
  {
    accessorKey: 'destinationStation',
    header: 'Destination Station',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
