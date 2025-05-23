'use client';

import { DataTableTotalCols } from "@/components/ui/table/data-table-total-row";
import { columns } from "./columns";
import { type ExpenseReport } from "@/app/actions/expenses.action";
import { useTableFilters } from "./use-table-filters";
import { DateFilterBox } from "@/components/date/DateFilterBox";
import { DataTableMultiFilterBox } from "@/components/ui/table/data-table-multi-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";

interface ExpenseTableProps {
  data: Partial<ExpenseReport>[];
  totalItems: number;
  columnTotals: Record<string, null | number>;
}

export default function RouteTable({ data, totalItems, columnTotals, }: ExpenseTableProps) {

  const {
    isAnyFilterActive,
    resetFilters,
    BUS_OPTIONS,
    setPage,
    setPageSize,
    setSearchQuery,
    setBusIdFilters,
    setDateFilter,
    page,
    pageSize,
    searchQuery,
    busIdFilters,
    dateFilter
  } = useTableFilters();

  return (
    <div className='min-h-[80dvh] flex flex-1 flex-col space-y-4'>

      <div className='flex flex-wrap items-start gap-4'>
        {/* TODO: Refactor the DateFilterBox thingi define a single component, use everywhere. */}
        <DateFilterBox
          filterKey="date"
          title="Date"
          filterValue={dateFilter}
          setFilterValue={setDateFilter}
        />

        <DataTableMultiFilterBox
          filterKey="busNumber"
          title="Bus Number"
          options={BUS_OPTIONS}
          setFilterValue={setBusIdFilters}
          filterValue={busIdFilters}
        />

        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTableTotalCols
        columns={columns}
        data={data}
        totalItems={totalItems}
        columnTotals={columnTotals}
      />
    </div>
  )
}