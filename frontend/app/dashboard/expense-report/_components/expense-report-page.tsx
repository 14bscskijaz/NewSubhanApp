"use client";

import { useEffect, useState } from "react";
import { getExpenseReports, type ExpenseReport } from "@/app/actions/expenses.action";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import ExpenseReportTable from "./expense-report-table";
import axios from "axios";
import { getLogger } from "@/lib/logger";
import { parseAsString, useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchparams";
import { parseDateRange } from "@/lib/utils/date";
import { getAllBuses } from "@/app/actions/bus.action";
import { useDispatch } from "react-redux";
import { setBus } from "@/lib/slices/bus-slices";
import { toast } from "sonner";
import { QueryParams } from "@/types";

// const clientLogger = getLogger("expense-report");

export default function ExpenseReportPage() {
  const dispatch = useDispatch();

  const [expensesReports, setExpenseReports] = useState<ExpenseReport[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [columnTotals, setColumnTotals] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useQueryState("page", searchParams.page.withOptions({ shallow: false }));
  const [pageSize, setPageSize] = useQueryState("pageSize", searchParams.pageSize.withOptions({ shallow: false }));
  const [dateFilter, setDateFilter] = useQueryState('date', searchParams.date.withOptions({ shallow: false }));
  const [busIdsFilter, setBusIdsFilter] = useQueryState("busId", parseAsString.withOptions({ shallow: false}));

  const { start, end } = parseDateRange(dateFilter);

  const queryParams: QueryParams = {
    page: page,
    pageSize: pageSize,
    ...(start && {startDate: start}),
    ...(end && {endDate: end}),
    ...(busIdsFilter && {busId: busIdsFilter.split('.')})
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getExpenseReports(queryParams);
      // console.log("Fetched Expense Reports:", data);
      setExpenseReports(data.items);
      setTotalItems(data.totalItems);
      setColumnTotals(data.columnTotals || {});
    } catch (error) {
      toast.error("Failed to fetch expense reports");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchBuses = async () => {
      const allBus = await getAllBuses();
      dispatch(setBus(allBus));
    }

    fetchBuses();
  }, [])

  useEffect(() => {

    fetchData();

  }, [page, pageSize, dateFilter, busIdsFilter])

  return(
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            // title={`Bus Report (${totalBusReport})`}
            title="Expense Report"
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
          <ExpenseReportTable
            data={expensesReports}
            totalItems={totalItems}
            columnTotals={columnTotals}
          />
        )}

      </div>
    </PageContainer>
  );
}