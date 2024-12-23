import { Button } from '@/components/ui/button';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Map, ReceiptText, Waypoints } from 'lucide-react';
import { DateFilterBox } from '../ui/DateFilterBox';
import { DataTableFilterBoxView } from '../ui/data-table-filter-box-view';
import { columns } from './columns';
import { DataTableView } from './data-table-view';
import { useRouteTableFilters } from './use-route-table-filters';
import { StationsColumn } from './StationsColumn';

export default function RouteTable({
  data,
  totalData,
  totalRevenue,
  printExpenses,
  isCityTab,
  setIsCityTab
}: {
  data: any[];
  totalData: number;
  totalRevenue: number;
  printExpenses: () => void;
  isCityTab: boolean;
  setIsCityTab: any
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
        <div className="flex flex-wrap center  justify-between w-full ">
          <div className='flex justify-center items-center gap-4'>
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
          <div className='bg-gray-50 p-1 flex justify-between items-center gap-4 rounded-lg border bg-gradient-border transition-all duration-500'>
            <span className={` p-2 cursor-pointer rounded-lg ${isCityTab?"text-white bg-gradient-2":"text-gradient"} transition-all duration-300`} onClick={()=>setIsCityTab(true)}><Map /></span>
            <span className={` p-2 cursor-pointer rounded-lg ${!isCityTab?"text-white bg-gradient-2":"text-gradient"} transition-all duration-300`} onClick={()=>setIsCityTab(false)}><Waypoints /></span>
          </div>
        </div>
      </div>
      {isCityTab ? <DataTableView
        columns={columns}
        data={data}
        totalItems={totalData}
        totalRevenue={totalRevenue}
      /> : <DataTableView
        columns={StationsColumn}
        data={data}
        totalItems={totalData}
        totalRevenue={totalRevenue}
      />
      }
    </div>
  );
}
