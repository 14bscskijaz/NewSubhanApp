"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableTotalCols } from "@/components/ui/table/data-table-total-row";
import { columns } from "./columns";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import axios from "axios";
import { getLogger } from "@/lib/logger";
import { searchParams } from "@/lib/searchparams";
import { parseDateRange } from "@/lib/utils/date";
import { type BusReport, getAllBuses, getBusReports } from "@/app/actions/bus.action";
import { useDispatch } from "react-redux";
import { Buses, setBus } from "@/lib/slices/bus-slices";
import { Button } from "@/components/ui/button";
import { DateFilterBox } from "@/components/date/DateFilterBox";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { ReceiptText } from "lucide-react";
import { DataTableMultiFilterBox } from "@/components/ui/table/data-table-multi-filter-box";


export default function BusReportPage() {
  
  const [busesOptions, setBusesOptions] = useState<{label: string, value: string}[]>([]);
  const [busReports, setBusReports] = useState<BusReport[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [columnTotals, setColumnTotals] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useQueryState("page", searchParams.page.withOptions({ shallow: false }));
  const [limit, setLimit] = useQueryState("limit", searchParams.limit.withOptions({ shallow: false }));
  const [dateFilter, setDateFilter] = useQueryState('date', searchParams.date.withOptions({ shallow: false }));
  const [busIdFilters, setBusIdFilters] = useQueryState("bus", parseAsString
    .withOptions({ shallow: false}).withDefault("") );

  const { start, end } = parseDateRange(dateFilter);

  const resetFilters = useCallback(() => {
    // setSearchQuery(null);
    // setBusNumberFilter(null);
    // setbusownerfilter(null);
    setBusIdFilters("");
    setDateFilter(null);
    setPage(1);
  }, [setDateFilter, setPage]);


  const isAnyFilterActive = useMemo(() => {
    return !!dateFilter || !!busIdFilters;
  }, [dateFilter, busIdFilters]);

  const urlParams ={
    page: page.toString(),
    pageSize: limit.toString(),
    startDate: start ? start.toISOString() : "",
    endDate: end ? end.toISOString() : "",
    busId: busIdFilters ? busIdFilters.split('.') : []
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getBusReports(urlParams);
      // console.log("Fetched Bus Reports:", data);
      setBusReports(data.items);
      setTotalItems(data.totalItems);
      setColumnTotals(data.columnTotals || {});
    } catch (error) {
      toast.error("Failed to fetch expense reports");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    fetchData();

  }, [page, limit, dateFilter, busIdFilters])

  useEffect(() => {
    const fetchBuses = async () => {
      const allBus: Buses[] = await getAllBuses();
      const busOptions = allBus.map(bus => ({
        value: `${bus.id}`,
        label: bus.busNumber
      }));
      setBusesOptions(busOptions); 
    }

    fetchBuses();
  }, [])


  return (<>
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading
              title={`Bus Report (${totalItems})`}
              description=""
            />
          </div>

          <Separator />

            {isLoading ? (
              <DataTableSkeleton 
                columnCount={6} 
                rowCount={10}
                searchableColumnCount={1}
                filterableColumnCount={2} 
                showViewOptions={true}
              />
            ) : (
              <div className="min-h-[80dvh] flex flex-1 flex-col space-y-4">
                <div className="flex flex-col flex-wrap items-start gap-4">
                  <div className=' w-full flex justify-between items-center gap-4'>
                    {/* <SearchTable
                      searchKey="name"
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      setPage={setPage}
                    />
                    <Button
                      className={`border p-1.5 rounded-sm bg-gradient-border hover:bg-gradient-2 active:opacity-50 group transition-all duration-500 ${
                        totalItems ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      onClick={printExpenses}
                      disabled={totalItems}
                    >
                      <ReceiptText
                        className={`text-gradient ${
                          totalItems ? 'opacity-50' : 'group-hover:text-gradient-2'
                        }`}
                      />
                    </Button> */}
                  </div>
                  <div className='flex flex-wrap items-start gap-4'>

                    <DataTableMultiFilterBox
                      filterKey="busNumber"
                      title="Bus Number"
                      options={busesOptions}
                      setFilterValue={setBusIdFilters}
                      filterValue={busIdFilters}
                    />
                    {/*>
                    <DataTableFilterBoxView
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
                </div>
                <DataTableTotalCols
                  columns={columns}
                  data={busReports}
                  totalItems={totalItems}
                />
              </div>
            )}

        </div>
      </div>
    </PageContainer>

  </>)
}