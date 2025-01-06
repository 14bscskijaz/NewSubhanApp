'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { ReceiptText } from 'lucide-react';
import { DateFilterBox } from '../ui/DateFilterBox';
import { DataTableFilterBoxView } from '../ui/data-table-filter-box-view';
import { columns } from './columns';
import { useRouteTableFilters } from './use-route-table-filters';

export default function RouteTable({
  data,
  totalData,
  printExpenses
}: {
  data: any;
  totalData: number;
  printExpenses: () => void;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    DRIVER_OPTIONS,
    driverFilter,
    setDriverFilter,
    page,
    dateFilter,
    setDateFilter,
    searchQuery,
    setPage,
    setSearchQuery
  } = useRouteTableFilters();

  const isDataEmpty = data.length === 0;

  return (
    <div className="space-y-4 ">
      <div className="flex flex-col flex-wrap items-start gap-4">
        <div className=' w-full flex justify-between items-center gap-4'>
          <div className='flex flex-wrap items-start gap-4'>

            <DataTableFilterBoxView
              filterKey="driver"
              title="Driver"
              options={DRIVER_OPTIONS}
              setFilterValue={setDriverFilter}
              filterValue={driverFilter}
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
          {/* <SearchTable
            searchKey="name"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          /> */}
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
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
