'use client';
import { ClosingExpense } from '@/lib/slices/fixed-closing-expense-slice'; // Adjust import if needed
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import SourceDestination from './SourceDestination';
import SourceStationDestinationStation from './SourceStationDestinationStation';

export const columns: ColumnDef<ClosingExpense>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },
  {
    id: 'source-destination',
    header: 'Route',
    cell: ({ row }) => <SourceDestination routeId={row.original.RouteId} />
  },
  {
    id: 'source-station-destination-station',
    header: 'Station',
    cell: ({ row }) => (
      <SourceStationDestinationStation routeId={row.original.RouteId} />
    )
  },
  {
    accessorKey: 'DriverCommission',
    header: 'Driver Commission'
  },
  {
    accessorKey: 'COilExpense',
    header: 'C. Oil Expense'
  },
  {
    accessorKey: 'TollTax',
    header: 'Toll Tax'
  },
  {
    accessorKey: 'HalfSafai',
    header: 'Half Safai'
  },
  {
    accessorKey: 'FullSafai',
    header: 'Full Safai'
  },
  {
    accessorKey: 'refreshmentRate',
    header: 'Refreshment Rate'
  },
  {
    accessorKey: 'DcParchi',
    header: 'DC Parchi (Fsd Only)'
  },
  {
    accessorKey: 'alliedMorde',
    header: 'Allied Morde'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
