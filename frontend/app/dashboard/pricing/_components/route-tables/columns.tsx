'use client';
import { TicketPriceRaw } from '@/lib/slices/pricing-slices';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { TicketPriceDisplay } from '../pricing-listing-page';

export const columns: ColumnDef<TicketPriceDisplay>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: 'source',
    header: 'Source'
  },
  {
    accessorKey: 'sourceStation',
    header: 'Source Station'
  },
  {
    accessorKey: 'destination',
    header: 'Destination'
  },
  {
    accessorKey: 'destinationStation',
    header: 'Destination Station'
  },
  {
    accessorKey: 'ticketPrice',
    header: 'Price'
  },
  {
    accessorKey: 'busType',
    header: 'Bus Type'
  },
  {
    id: 'actions',
    accessorKey: 'notes',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
