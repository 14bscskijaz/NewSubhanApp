'use server'
import { Expense } from "@/lib/slices/expenses-slices";
import axios from "axios";

// const API_BASE_URL = "https://localhost:7169/api/Expense";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/Expense";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
});

// Get all expenses
export async function getAllExpenses(): Promise<Expense[]> {
    try {
        const response = await axiosInstance.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
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

