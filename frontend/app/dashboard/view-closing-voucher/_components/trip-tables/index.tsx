'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { DateFilterBox } from '../ui/DateFilterBox';
import { DataTableFilterBoxView } from '../ui/data-table-filter-box-view';
import { columns } from './columns';
import { useRouteTableFilters } from './use-route-table-filters';
import { DataTableView } from './data-table-view';
import { ReceiptText } from 'lucide-react';

export default function RouteTable({
  data,
  totalData,
  totalRevenue,
  totalExpense,
  printExpenses
}: {
  data: BusClosingVoucher[];
  totalData: number;
  totalExpense: number;
  totalRevenue: number;
  printExpenses:()=>void;
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

  return (
    <div className="space-y-4 ">
      <div className="flex flex-col flex-wrap items-start gap-4">
        <div className=' w-full flex justify-between items-center'>
          <DataTableSearch
            searchKey="name"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />
          <div className='border p-1.5 rounded-sm cursor-pointer bg-gradient-border hover:bg-gradient-2 active:opacity-50 group transition-all duration-500' onClick={printExpenses}>
            <ReceiptText className='text-gradient group-hover:text-gradient-2' />
          </div>
        </div>
        <div className='flex flex-wrap items-start gap-4'>

          <DataTableFilterBoxView
            filterKey="busNumber"
            title="Bus Number"
            options={BUS_OPTIONS}
            setFilterValue={setBusNumberFilter}
            filterValue={busNumberFilter}
          />
          <DataTableFilterBoxView
            filterKey="route"
            title="Route"
            options={ROUTE_OPTIONS}
            setFilterValue={setRouteFilter}
            filterValue={routeFilter}
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
      </div>
      <DataTableView columns={columns} data={data} totalItems={totalData} totalRevenue={totalRevenue} totalExpense={totalExpense} />
    </div>
  );
}
