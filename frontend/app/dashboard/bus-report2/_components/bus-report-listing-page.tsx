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
import { searchParams, serialize } from "@/lib/searchparams";
import { parseDateRange } from "@/lib/utils/date";
import { type BusReport, getAllBuses, getBusReports } from "@/app/actions/bus.action";
import { useDispatch } from "react-redux";
import { Buses, setBus } from "@/lib/slices/bus-slices";
import { Button } from "@/components/ui/button";
import { DateFilterBox } from "@/components/date/DateFilterBox";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { ReceiptText } from "lucide-react";
import { DataTableMultiFilterBox } from "@/components/ui/table/data-table-multi-filter-box";
import { QueryParams } from "@/types";


export default function BusReportPage() {
  
  const [busesOptions, setBusesOptions] = useState<{label: string, value: string}[]>([]);
  const [busReports, setBusReports] = useState<BusReport[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [columnTotals, setColumnTotals] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useQueryState("page", searchParams.page.withOptions({ shallow: false }));
  const [pageSize, setPageSize] = useQueryState("pageSize", searchParams.pageSize.withOptions({ shallow: false }));
  const [dateFilter, setDateFilter] = useQueryState('date', searchParams.date.withOptions({ shallow: false }));
  const [busIdsFilter, setBusIdsFilter] = useQueryState("busId", searchParams.busId.withOptions({ shallow: false}) );

  const { start, end } = parseDateRange(dateFilter);

  const resetFilters = useCallback(() => {
    // setSearchQuery(null);
    // setBusNumberFilter(null);
    // setbusownerfilter(null);
    setBusIdsFilter("");
    setDateFilter(null);
    setPage(1);
  }, [setDateFilter, setPage]);


  const isAnyFilterActive = useMemo(() => {
    return !!dateFilter || !!busIdsFilter;
  }, [dateFilter, busIdsFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    const queryParams: QueryParams = {
      page: page,
      pageSize: pageSize,
      ...(start && {startDate: start}),
      ...(end && {endDate: end}),
      ...(busIdsFilter && {busId: busIdsFilter.split('.')})
    }

    try {
      const data = await getBusReports(queryParams);
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

  /**
   * Handles the PDF print/ download functionality.
   */
  const handleDownloadPdf = useCallback(() => {
    const params = {
      page: page,
      pageSize: pageSize,
      date: dateFilter,
      busId: busIdsFilter,
    };
    const queryString = serialize(params);

    try {
      // Build PDF URL with our utility function
      // const pdfUrl = `/dashboard/finance/receivables/pdf?date=${dateFilter}&route=${routeFilter}&aggregate=${aggregateFilter}`;
      const pdfUrl = `/dashboard/bus-report2/pdf${queryString}`;
      // console.log("pdfURL: ", pdfUrl);
      // const pdfUrl = `/dashboard/finance/receivables/pdf`;
      
      // Open the PDF in a new tab - this will trigger the download
      window.open(pdfUrl, '_blank');
      
      toast.success('PDF report is being generated');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF report');
    }
  }, [page, pageSize, dateFilter, busIdsFilter]);

  useEffect(() => {

    fetchData();

  }, [page, pageSize, dateFilter, busIdsFilter])

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
                <div className="flex flex-row justify-between flex-wrap items-start gap-4">
                  <div className='flex flex-wrap items-start gap-4'>

                    <DataTableMultiFilterBox
                      filterKey="busNumber"
                      title="Bus Number"
                      options={busesOptions}
                      setFilterValue={setBusIdsFilter}
                      filterValue={busIdsFilter}
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
                  <div className='flex items-center gap-4'>
                    <Button
                      className={`border p-1.5 rounded-sm bg-gradient-border hover:bg-gradient-2 active:opacity-50 group transition-all duration-500 ${
                        (totalItems == 0) ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      onClick={handleDownloadPdf}
                      disabled={totalItems == 0}
                    >
                      <ReceiptText
                        className={`text-gradient ${
                          (totalItems == 0) ? 'opacity-50' : 'group-hover:text-gradient-2'
                        }`}
                      />
                    </Button>
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