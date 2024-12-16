'use server'
import { FixedTripExpense } from "@/lib/slices/fixed-trip-expense";
import axios from "axios";

// const API_BASE_URL = "https://localhost:7169/api/FixedTripExpense";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/FixedTripExpense";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
});

// Get all fixed trip expenses
export async function getAllFixedTripExpenses(): Promise<FixedTripExpense[]> {
    try {
        const response = await axiosInstance.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching fixed trip expenses:", error);
        throw error;
    }
}

// Create a new fixed trip expense
export async function createFixedTripExpense(fixedTripExpense: Omit<FixedTripExpense,"id">): Promise<Omit<FixedTripExpense,"id">> {
    try {
        const response = await axiosInstance.post(API_BASE_URL, fixedTripExpense);
        return response.data;
    } catch (error) {
        console.error("Error creating fixed trip expense:", error);
        throw error;
    }
}

// Update an existing fixed trip expense
export async function updateFixedTripExpenses(id: number, updatedFixedTripExpense: Partial<FixedTripExpense>): Promise<FixedTripExpense> {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedFixedTripExpense);
        return response.data;
    } catch (error) {
        console.error("Error updating fixed trip expense:", error);
        throw error;
    }
}

// Delete a fixed trip expense by ID
export async function deleteFixedTripExpense(id: number): Promise<void> {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting fixed trip expense:", error);
        throw error;
    }
}

