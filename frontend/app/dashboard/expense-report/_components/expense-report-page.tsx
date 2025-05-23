"use client";

import { useEffect, useState } from "react";
import { type ExpenseReport } from "@/app/actions/expenses.action";
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
import qs from "qs";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/Expense";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
});

const clientLogger = getLogger("expense-report");


export default function ExpenseReportPage() {
  const dispatch = useDispatch();

  const [expensesReports, setExpenseReports] = useState<ExpenseReport[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [columnTotals, setColumnTotals] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useQueryState("page", searchParams.page.withOptions({ shallow: false }));
  const [limit, setLimit] = useQueryState("limit", searchParams.limit.withOptions({ shallow: false }));
  const [dateFilter, setDateFilter] = useQueryState('date', searchParams.date.withOptions({ shallow: false }));
  const [busIdFilters, setBusIdFilters] = useQueryState("bus", parseAsString.withOptions({ shallow: false}));

  const { start, end } = parseDateRange(dateFilter);

  const urlParams ={
    page: page.toString(),
    pageSize: limit.toString(),
    startDate: start ? start.toISOString() : "",
    endDate: end ? end.toISOString() : "",
    busId: busIdFilters ? busIdFilters.split('.') : []
  };

  // console.log("URL Params:", urlParams);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/Report`, {
        params: urlParams
      });
      // console.log(response.data);
      clientLogger.info('Fetched all expense reports successfully', {
        expenseReportCount: String(response.data.items.length),
        lastExpenseReport: JSON.stringify(response.data.items[ response.data.items.length - 1]),
      })
      setExpenseReports(response.data.items);
      setTotalItems(response.data.totalItems);
      setColumnTotals(response.data.columnTotals || {});
    } catch (error) {
      console.error("Error fetching expense reports:", error);
      clientLogger.error('Error fetching all expense reports', {
        err: error,
      });
      throw error;
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

  }, [page, limit, dateFilter, busIdFilters])

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