'use server'
import { getLogger, getServerLogger } from "@/lib/logger";
import { Expense } from "@/lib/slices/expenses-slices";
import axios from "axios";
import { get } from "http";
import qs from "qs";

type ActionResponse<T> = {
  success: boolean;
  message?: string;
  data?: T | T[];
  meta?: {
    totalItems?: number;
    columnTotals?: Record<string, null | number>;
    page?: number;
    limit?: number;
  };
  error?: any;
}

export type ExpenseReport = {
  id: number;
  date: string;
  type: 'bus' | 'general';
  busClosingVoucherId?: number | null;
  busId?: number;
  busNumber?: string;
  routeId?: number;
  amount: number;
  description: string;
  originalId?: number; // Make sure originalId is included
};

// const API_BASE_URL = "https://localhost:7169/api/Expense";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/Expense";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
});

const serverLogger = getServerLogger();

// Get all expenses
export async function getAllExpenses(): Promise<Expense[]> {
    try {
        const response = await axiosInstance.get(API_BASE_URL);

        serverLogger.info({
            expenseCount: String(response.data.length),
            lastExpense: JSON.stringify(response.data[ response.data.length - 1]),
            customCount: 400,
          },
          'Fetched all expenses successfully'
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        serverLogger.error({
            err: error,
          },
          'Error fetching all expenses'
        );
        throw error;
    }
}

// Get a single expense by ID
export async function getExpenseById(id: number): Promise<Expense> {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching expense with id ${id}:`, error);
        throw error;
    }
}

// Create a new expense
export async function createExpense(expense: Expense): Promise<Expense> {
    try {
        const response = await axiosInstance.post(API_BASE_URL, expense);
        return response.data;
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
    }
}

// Update an existing expense
export async function updateExpense(id: number, updatedExpense: Partial<Expense>): Promise<Expense> {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedExpense);
        return response.data;
    } catch (error) {
        console.error(`Error updating expense with id ${id}:`, error);
        throw error;
    }
}

// Delete an expense by ID
export async function deleteExpense(id: number): Promise<void> {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting expense with id ${id}:`, error);
        throw error;
    }
}

export async function getExpenseReports(urlParams: any): Promise<any> {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/Report`, {
      params: urlParams
    });
    // console.log(response.data);
    serverLogger.info({
      expenseReportCount: String(response.data.items.length),
      lastExpenseReport: JSON.stringify(response.data.items[ response.data.items.length - 1]),
      },
      'Fetched all expense reports successfully'
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching expense reports:", error);
    serverLogger.error({
        err: error,
      },
      'Error fetching all expense reports'
    );
    throw error;
  }
}

// export async function getExpenseReportById(id: number): Promise<ExpenseReport> {

//     try {
//       const response = await axiosInstance.get(`${API_BASE_URL}/Report`, {
//         params: urlParams
//       });
//       // console.log(response.data);
//       clientLogger.info('Fetched all expense reports successfully', {
//         expenseReportCount: String(response.data.items.length),
//         lastExpenseReport: JSON.stringify(response.data.items[ response.data.items.length - 1]),
//       })
//       setExpenseReports(response.data.items);
//       setTotalItems(response.data.totalItems);
//       setColumnTotals(response.data.columnTotals || {});
//     } catch (error) {
//       console.error("Error fetching expense reports:", error);
//       clientLogger.error('Error fetching all expense reports', {
//         err: error,
//       });
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }