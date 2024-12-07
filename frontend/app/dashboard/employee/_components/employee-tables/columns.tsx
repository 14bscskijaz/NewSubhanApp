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
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`
  },
  {
    accessorKey: 'cnic',
    header: 'CNIC',
    cell: ({ row }) => row.original.cnic 
  },
  {
    accessorKey: 'employeeType',
    header: 'Employee Type'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'mobileNumber',
    header: 'Mobile Number'
  },
  {
    accessorKey: 'hireDate',
    header: 'Hire Date',
    cell: ({ row }) =>
      row.original.hireDate
        ? new Date(row.original.hireDate).toLocaleDateString('en-GB')
        : ''
  },
  {
    accessorKey: 'employee_status',
    header: 'Employee Status',
    cell: ({ row }) => <StatusBadge status={row.original.employeeStatus} />
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
