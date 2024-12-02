'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { ExpandableText } from './expand-text';
import { StatusBadge } from './status-badge';
import { Buses } from '@/lib/slices/bus-slices';


export const columns: ColumnDef<Buses>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => <div className="w-12">{row.index + 1}</div>, 
    meta: {
      className: 'w-12', 
    },
  },
  {
    accessorKey: 'busNumber',
    header: 'Bus Number',
  },
  {
    accessorKey: 'busType',
    header: 'Bus Type',
  },
  {
    accessorKey: 'busOwner',
    header: 'Bus Owner',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <ExpandableText text={row.original.description} />,
  },
  {
    accessorKey: 'busStatus',
    header: 'Bus Status',
    cell: ({ row }) => <StatusBadge status={row.original.busStatus} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];


