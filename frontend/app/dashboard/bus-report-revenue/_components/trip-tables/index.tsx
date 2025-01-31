'use client';

import { Button } from '@/components/ui/button';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { BusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { ReceiptText } from 'lucide-react';
import { DateFilterBox } from '../ui/DateFilterBox';
import { DataTableFilterBoxView } from '../ui/data-table-filter-box-view';
import { columns } from './columns';
import { useRouteTableFilters } from './use-route-table-filters';
import { DataTable } from '@/components/ui/table/data-table';
import { SearchTable } from './SearchTable';

export default function RouteTable({
  data,
  totalData,
  printExpenses
}: {
  data: any;
  totalData: number;
  printExpenses?: () => void;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    BUS_OPTIONS,
    ROUTE_OPTIONS,
    BUS_OWNER_OPTIONS,
    setBusNumberFilter,
    dateFilter,
    setDateFilter,
    busNumberFilter,
    ownerFilter,
    setBusOwnerFilter,
    searchQuery,
    setPage,
    setSearchQuery
  } = useRouteTableFilters();

  const isDataEmpty = data.length === 0;

  return (
    <div className="space-y-4 ">
      <div className="flex flex-wrap justify-between items-start gap-4">
        {/* <SearchTable
            searchKey="name"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          /> */}
        <div className='flex flex-wrap items-start gap-4'>

          <DataTableFilterBoxView
            filterKey="busNumber"
            title="Bus Number"
            options={BUS_OPTIONS}
            setFilterValue={setBusNumberFilter}
            filterValue={busNumberFilter}
          />
          {/* <DataTableFilterBoxView
  filterKey="busOwner"
  title="Bus Owner"
  options={BUS_OWNER_OPTIONS}
  setFilterValue={setBusOwnerFilter}
  filterValue={ownerFilter}
/> */}
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
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
