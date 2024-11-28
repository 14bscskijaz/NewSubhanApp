'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  ClosingExpense,
  allClosingExpenses
} from '@/lib/slices/fixed-closing-expense-slice'; // Import ClosingExpense
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NewTripDialog from './new-expense-dialogue'; // Consider renaming if it's specific to Trip, e.g. "NewClosingExpenseDialog"
import ClosingExpenseTable from './route-closing-tables'; // You may need to rename the table component
import NewExpenseDialog from './new-expense-dialogue';

type TExpenseListingPage = {};

export default function ClosingExpenseListingPage({}: TExpenseListingPage) {
  const closingExpenses = useSelector<RootState, ClosingExpense[]>(
    allClosingExpenses
  );
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const countParam = searchParams.get('count') || '';
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(countParam);
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  // Filter closing expenses based on search and source (RouteId)
  const filteredClosingExpenses = closingExpenses.filter((expense) => {
    const matchesSearch = search
      ? expense.driverCommission.toString().includes(search.toLowerCase()) ||
        expense.coilExpense.toString().includes(search.toLowerCase()) ||
        expense.tollTax.toString().includes(search.toLowerCase()) ||
        expense.halfSafai.toString().includes(search.toLowerCase()) ||
        expense.fullSafai.toString().includes(search.toLowerCase()) ||
        expense.refreshmentRate.toString().includes(search.toLowerCase()) ||
        expense.dcParchi.toString().includes(search.toLowerCase()) ||
        expense.alliedMorde.toString().includes(search.toLowerCase())
      : true;

    const matchesCount = source
      ? expense.routeId.toString() === source.toLowerCase()
      : true;

    return matchesSearch && matchesCount;
  });

  const totalClosingExpense = filteredClosingExpenses.length;

  // Pagination logic
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedClosingExpenses = filteredClosingExpenses.slice(
    startIndex,
    endIndex
  );

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Closing Expenses (${totalClosingExpense})`}
            description="Manage your closing expenses for trips."
          />
          <NewExpenseDialog />
        </div>
        <Separator />
        <ClosingExpenseTable
          data={paginatedClosingExpenses}
          totalData={totalClosingExpense}
        />
      </div>
    </PageContainer>
  );
}
