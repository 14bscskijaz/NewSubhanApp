'use client';
import { ColumnDef } from '@tanstack/react-table';
import { TicketPriceDisplay } from '../pricing-listing-page';
import { CellAction } from './cell-action';

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
    id: 'busType',
    header: 'Bus Type',
    cell: ({ row }) => <div>{row?.original?.busType}</div>
  },
  {
    id: 'actions',
    accessorKey: 'notes',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
