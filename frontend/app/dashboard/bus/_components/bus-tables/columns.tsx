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
    cell: ({ row }) => <div className="w-12">{row.index + 1}</div>, // Apply a width class here
    meta: {
      className: 'w-12', // Apply width class for header as well
    },
  },
  {
    accessorKey: 'bus_number',
    header: 'Bus Number',
  },
  {
    accessorKey: 'bus_type',
    header: 'Bus Type',
  },
  {
    accessorKey: 'bus_owner',
    header: 'Bus Owner',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <ExpandableText text={row.original.description} />,
  },
  {
    accessorKey: 'bus_status',
    header: 'Bus Status',
    cell: ({ row }) => <StatusBadge status={row.original.bus_status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];


