'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { Expense } from '@/lib/slices/expenses-slices';
import { BusExpensecolumns } from './BusExpenseColumn';
import { DataTableBusExpense } from './data-table-bus-expense';
import {
  useExpensesTableFilters
} from './use-expenses-table-filters';

export default function BusExpenseTable({
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
      <DataTableBusExpense columns={BusExpensecolumns} data={data} totalItems={totalData} />
      
    </div>
  );
}
