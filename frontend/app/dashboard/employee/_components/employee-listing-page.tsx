"use client";
import { getAllEmployees } from '@/app/actions/employee.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Employee, allEmployees, setEmployee } from '@/lib/slices/employe-slices';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmployeeTable from './employee-tables';
import NewEmployeeDialog from './new-employee-dialogue';

type TEmployeeListingPage = {};

export default function EmployeeListingPage({}: TEmployeeListingPage) {
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pageLimit, setPageLimit] = useState(5);

  const dispatch = useDispatch();

  const fetchEmoployee = async() =>{
    const allEmployeeData = await getAllEmployees()
    dispatch(setEmployee(allEmployeeData))
    
  }

  useEffect(() => {
    fetchEmoployee()
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const statusParam = searchParams.get('status') || '';
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setStatus(statusParam);
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      search ?
        employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(search.toLowerCase()) :
        true;

    const matchesStatus =
      status ?
        employee.employeeStatus.toLowerCase() === status.toLowerCase() : 
        true;

    return matchesSearch && matchesStatus;
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
