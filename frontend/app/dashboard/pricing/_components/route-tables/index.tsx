'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { TicketPriceDisplay } from '../pricing-listing-page';
import { columns } from './columns';
import {
  SOURCE_OPTIONS,
  useRouteTableFilters
} from './use-route-table-filters';

export default function RouteTable({
  data,
  totalData
}: {
  data: TicketPriceDisplay[];
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
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
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
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
