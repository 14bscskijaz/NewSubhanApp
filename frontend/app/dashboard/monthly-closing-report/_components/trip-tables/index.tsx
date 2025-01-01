'use client';

import { Button } from '@/components/ui/button';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { ReceiptText } from 'lucide-react';
import { DateFilterBox } from '../ui/DateFilterBox';
import { DataTableFilterBoxView } from '../ui/data-table-filter-box-view';
import { columns } from './columns';
import { DataTableView } from './data-table-view';
import { useRouteTableFilters } from './use-route-table-filters';
import { Expense } from '@/lib/slices/expenses-slices';

export default function RouteTable({
  data,
  totalData,
  totalRevenue,
  totalExpense,
  printExpenses
}: {
  data: Expense[];
  totalData: number;
  totalExpense: number;
  totalRevenue: number;
  printExpenses: () => void;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    BUS_OPTIONS,
    ROUTE_OPTIONS,
    setBusNumberFilter,
    dateFilter,
    setDateFilter,
    busNumberFilter,
    routeFilter,
    setRouteFilter,
    searchQuery,
    setPage,
    setSearchQuery
  } = useRouteTableFilters();

  const isDataEmpty = data.length === 0;

  return (
    <div className="space-y-4 ">
      <div className="flex flex-col flex-wrap items-start gap-4">
        <div className=' w-full flex justify-between items-center'>
          <div className='flex items-center justify-start gap-4'>
            <DataTableSearch
              searchKey="name"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setPage={setPage}
            />
            <DateFilterBox
              filterKey="date"
              title="Date"
              filterValue={dateFilter}
              setFilterValue={setDateFilter}
            />

            <DataTableResetFilter
              isFilterActive={isAnyFilterActive}
              onReset={resetFilters}
            />
          </div>
          <Button
            className={`border p-1.5 rounded-sm bg-gradient-border hover:bg-gradient-2 active:opacity-50 group transition-all duration-500 ${isDataEmpty ? 'cursor-not-allowed opacity-50' : ''
              }`}
            onClick={printExpenses}
            disabled={isDataEmpty}
          >
            <ReceiptText
              className={`text-gradient ${isDataEmpty ? 'opacity-50' : 'group-hover:text-gradient-2'
                }`}
            />
          </Button>
        </div>
      </div>
      <DataTableView columns={columns} data={data} totalItems={totalData} totalRevenue={totalRevenue} totalExpense={totalExpense} />
    </div>
  );
}
