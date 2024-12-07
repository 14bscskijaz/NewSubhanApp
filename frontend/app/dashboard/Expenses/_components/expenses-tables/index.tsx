'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { Expense } from '@/lib/slices/expenses-slices';
import { columns } from './columns';
import { DataTableExpense } from './data-table-expense';
import {
  useExpensesTableFilters
} from './use-expenses-table-filters';

export default function RouteTable({
  data,
  totalData
}: {
  data: Expense[];
  totalData: number;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
  } = useExpensesTableFilters();

  return (
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        {/* <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}
        {/* <DataTableFilterBox
          filterKey="source"
          title="Source"
          options={SOURCE_OPTIONS}
          setFilterValue={setSourceFilter}
          filterValue={sourceFilter}
        /> */}
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTableExpense columns={columns} data={data} totalItems={totalData} />
      
    </div>
  );
}
