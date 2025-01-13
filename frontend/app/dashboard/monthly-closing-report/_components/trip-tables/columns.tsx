// columns.tsx
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { formatNumber } from 'accounting';

export const columns:ColumnDef<any>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },

  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) =>
      row.original.date
        ? new Date(row.original.date).toISOString().split("T")[0]
        : ''
  },
  // {
  //   accessorKey: 'voucherNumber',
  //   header: 'VoucherNumber',
  // },
  // {
  //   id: 'busNumber',
  //   header: 'Bus Number',
  //   cell: (
  //     { row }
  //   ) => <BusNumber busId={Number(row.original.busId)} />
  // },
  // {
  //   id: 'source-destination',
  //   header: 'Route',
  //   cell: (
  //     { row } // Parent component usage
  //   ) => <SourceDestination routeId={Number(row.original.routeId)} />
  // },
  // {
  //   id: 'source-station-destination-station',
  //   header: 'Station',
  //   cell: ({ row }) => (
  //     <SourceStationDestinationStation routeId={row?.original?.routeId || 1} />
  //   )
  // },
  {
    accessorKey: 'revenue',
    header: 'Gross Revenue',
    cell: (
      { row } // Parent component usage
    ) => <div>{formatNumber(row.original.revenue)}</div>
  },
  {
    accessorKey: 'expense',
    header: 'TotalExpense',
    cell: (
      { row } // Parent component usage
    ) => <div>{formatNumber(row.original.expense)}</div>
  },
  {
    accessorKey: 'netIncome',
    header: 'Net Income',
    cell: (
      { row } // Parent component usage
    ) => <div>{formatNumber(row.original.netIncome)}</div>
  },
  // {
  //   accessorKey: 'dcParchi',
  //   header: 'DC Parchi (Fsd Only)'
  // },
  // {
  //   accessorKey: 'refreshment',
  //   header: 'Refreshment'
  // },
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];
