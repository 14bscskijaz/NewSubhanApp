'use client';

import { DataTableTotalCols } from "@/components/ui/table/data-table-total-row";
import { columns } from "./columns";
import { type ExpenseReport } from "@/app/actions/expenses.action";
import { useTableFilters } from "./use-table-filters";
import { DateFilterBox } from "@/components/date/DateFilterBox";
import { DataTableMultiFilterBox } from "@/components/ui/table/data-table-multi-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { useCallback } from "react";
import { QueryParams } from "@/types";
import { parseDateRange } from "@/lib/utils/date";
import { serialize } from "@/lib/searchparams";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";
import { date } from "zod";

interface ExpenseTableProps {
  data: Partial<ExpenseReport>[];
  totalItems: number;
  columnTotals: Record<string, null | number>;
}

export default function RouteTable({ data, totalItems, columnTotals, }: ExpenseTableProps) {

  const {
    isAnyFilterActive,
    resetFilters,
    BUS_OPTIONS,
    setPage,
    setPageSize,
    setSearchQuery,
    setBusIdFilters,
    setDateFilter,
    page,
    pageSize,
    searchQuery,
    busIdsFilter,
    dateFilter
  } = useTableFilters();

  const { start, end } = parseDateRange(dateFilter);

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

    console.log("Date Filter:", dateFilter);
    const queryString = serialize(params);
    console.log("Query String for PDF:", queryString); 
    try {
      // Build PDF URL with our utility function
      // const pdfUrl = `/dashboard/finance/receivables/pdf?date=${dateFilter}&route=${routeFilter}&aggregate=${aggregateFilter}`;
      const pdfUrl = `/dashboard/expense-report/pdf${queryString}`;
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

  return (
    <div className='min-h-[80dvh] flex flex-1 flex-col space-y-4'>

      {/* Filter bar */}
      <div className="flex flex-row justify-between gap-4 sm:flex-row">
        <div className='flex flex-wrap items-start gap-4'>
          {/* TODO: Refactor the DateFilterBox thingi define a single component, use everywhere. */}
          <DateFilterBox
            filterKey="date"
            title="Date"
            filterValue={dateFilter}
            setFilterValue={setDateFilter}
          />

          <DataTableMultiFilterBox
            filterKey="busNumber"
            title="Bus Number"
            options={BUS_OPTIONS}
            setFilterValue={setBusIdFilters}
            filterValue={busIdsFilter}
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
        data={data}
        totalItems={totalItems}
        columnTotals={columnTotals}
      />
    </div>
  )
}