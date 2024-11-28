'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import {
  SOURCE_OPTIONS,
  useRouteTableFilters
} from './use-trip-info-table-filters';
import { BusClosing } from '@/lib/slices/bus-closing';
import { TripInformation } from '@/lib/slices/trip-information';

export default function RouteTable({
  data,
  totalData
}: {
  data: TripInformation[];
  totalData: number;
}) {
  const {
    sourceFilter,
    setSourceFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useRouteTableFilters();

  return (
    <div className="">
      <div className="flex flex-wrap items-center">
        {/* <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}
        {/* <DataTableFilterBox
          filterKey="source"
          title="source"
          options={SOURCE_OPTIONS}
          setFilterValue={setSourceFilter}
          filterValue={sourceFilter}
        /> */}
        {/* <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        /> */}
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
