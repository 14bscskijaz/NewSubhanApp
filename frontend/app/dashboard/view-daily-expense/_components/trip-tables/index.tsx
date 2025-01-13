'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { FixedTripExpense } from '@/lib/slices/fixed-trip-expense';
import { columns } from './columns';
import { useRouteTableFilters } from './use-route-table-filters';
import { Expense } from '@/lib/slices/expenses-slices';

export default function RouteTable({
  data,
  totalData
}: {
  data: any;
  totalData: number;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useRouteTableFilters();

  return (
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        {/* <DataTableFilterBox
          filterKey="count"
          title="count"
          options={TRIP_OPTIONS}
          setFilterValue={setSourceFilter}
          filterValue={sourceFilter}
        /> */}
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
