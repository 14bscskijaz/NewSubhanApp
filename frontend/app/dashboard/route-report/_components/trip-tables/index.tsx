import { useRef, useState } from 'react';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { Button } from '@/components/ui/button';
import { DateFilterBox } from '../ui/DateFilterBox';
import { DataTableFilterBoxView } from '../ui/data-table-filter-box-view';
import { DataTableView } from './data-table-view';
import { ReceiptText } from 'lucide-react';
import { useRouteTableFilters } from './use-route-table-filters';
import { columns } from './columns';

export default function RouteTable({
  data,
  totalData,
  totalRevenue,
  printExpenses
}: {
  data: any[];
  totalData: number;
  totalRevenue: number;
  printExpenses: () => void;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    ROUTE_OPTIONS,
    dateFilter,
    setDateFilter,
    routeFilter,
    setRouteFilter,
    searchQuery,
    setPage,
    setSearchQuery
  } = useRouteTableFilters();

  const isDataEmpty = data.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col flex-wrap items-start gap-4">
        <div className="w-full flex justify-between items-center">
          <DataTableSearch
            searchKey="name"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />
          <Button
            className={`border p-1.5 rounded-sm bg-gradient-border hover:bg-gradient-2 active:opacity-50 group transition-all duration-500 ${
              isDataEmpty ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={printExpenses}
            disabled={isDataEmpty}
          >
            <ReceiptText
              className={`text-gradient ${
                isDataEmpty ? 'opacity-50' : 'group-hover:text-gradient-2'
              }`}
            />
          </Button>
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <DataTableFilterBoxView
            filterKey="route"
            title="Route"
            options={ROUTE_OPTIONS}
            setFilterValue={setRouteFilter}
            filterValue={routeFilter}
          />
          <DateFilterBox
            filterKey="date"
            title="Date Range"
            filterValue={dateFilter}
            setFilterValue={setDateFilter}
          />
          <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
          />
        </div>
      </div>
      <DataTableView
        columns={columns}
        data={data}
        totalItems={totalData}
        totalRevenue={totalRevenue}
      />
    </div>
  );
}
