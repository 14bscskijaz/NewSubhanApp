'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { ExpandableText } from './expand-text';
import { StatusBadge } from './status-badge';
import { Employee } from '@/lib/slices/employe-slices';

export const columns: ColumnDef<Employee>[] = [
  {
    id: 'serial_no',
    header: 'S.No',
    cell: ({ row }) => row.index + 1
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`
  },
  {
    accessorKey: 'cnic',
    header: 'CNIC',
    cell: ({ row }) => row.original.cnic // Display the CNIC data
  },
  {
    accessorKey: 'employee_type',
    header: 'Employee Type'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'mobile_number',
    header: 'Mobile Number'
  },
  {
    accessorKey: 'hire_date',
    header: 'Hire Date',
    cell: ({ row }) =>
      row.original.hire_date
        ? new Date(row.original.hire_date).toLocaleDateString('en-GB')
        : ''
  },
  {
    accessorKey: 'employee_status',
    header: 'Employee Status',
    cell: ({ row }) => <StatusBadge status={row.original.employee_status} />
  },
  {
    accessorKey: 'dob',
    header: 'Date of Birth',
    cell: ({ row }) =>
      row.original.dob
        ? new Date(row.original.dob).toLocaleDateString('en-GB')
        : ''
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => <ExpandableText text={row.original.notes} />
  },
  {
    id: 'actions',
    accessorKey: 'notes',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
