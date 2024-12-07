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
    cell: ({ row }) => <SourceDestination routeId={row.original.routeId} />
  },
  {
    id: 'source-station-destination-station',
    header: 'Station',
    cell: ({ row }) => (
      <SourceStationDestinationStation routeId={row.original.routeId} />
    )
  },
  {
    accessorKey: 'driverCommission',
    header: 'Driver Commission'
  },
  {
    accessorKey: 'cOilExpense',
    header: 'C. Oil Expense'
  },
  {
    accessorKey: 'tollTax',
    header: 'Toll Tax'
  },
  {
    accessorKey: 'halfSafai',
    header: 'Half Safai'
  },
  {
    accessorKey: 'fullSafai',
    header: 'Full Safai'
  },
  {
    accessorKey: 'refreshmentRate',
    header: 'Refreshment Rate'
  },
  {
    accessorKey: 'dcPerchi',
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
