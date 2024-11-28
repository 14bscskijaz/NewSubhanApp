"use client";
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import EmployeeTable from './employee-tables';
import NewEmployeeDialog from './new-employee-dialogue';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

type TEmployeeListingPage = {};

export default function EmployeeListingPage({}: TEmployeeListingPage) {
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const searchParams = useSearchParams(); // Use the hook to access search params
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // Change gender to status
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const statusParam = searchParams.get('status') || ''; // Change from gender to status
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setStatus(statusParam); // Set status instead of gender
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      search ?
        employee.first_name.toLowerCase().includes(search.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(search.toLowerCase()) :
        true;

    const matchesStatus =
      status ?
        employee.employee_status.toLowerCase() === status.toLowerCase() : // Filter by employee status
        true;

    return matchesSearch && matchesStatus; // Combine both filters
  });

  const totalUsers = filteredEmployees.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Employee (${totalUsers})`}
            description=""
          />
          <NewEmployeeDialog />
        </div>
        <Separator />
        <EmployeeTable data={paginatedEmployees} totalData={totalUsers} />
      </div>
    </PageContainer>
  );
}
