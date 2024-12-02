import { ClosingExpense } from "@/lib/slices/fixed-closing-expense-slice";
import axios from "axios";

const API_BASE_URL = "https://localhost:7169/api/FixedBusClosingExpense";

// Get all fixed bus closing expenses
export async function getAllFixedBusClosingExpenses(): Promise<ClosingExpense[]> {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching fixed bus closing expenses:", error);
        throw error;
    }
}

// Create a new fixed bus closing expense
export async function createFixedBusClosingExpense(fixedBusClosingExpense: Omit<ClosingExpense,"id">): Promise<Omit<ClosingExpense,"id">> {
    try {
        const response = await axios.post(API_BASE_URL, fixedBusClosingExpense);
        return response.data;
    } catch (error) {
        console.error("Error creating fixed bus closing expense:", error);
        throw error;
    }
}

// Update an existing fixed bus closing expense
export async function updateFixedBusClosingExpense(id: number, updatedFixedBusClosingExpense: Partial<ClosingExpense>): Promise<ClosingExpense> {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, updatedFixedBusClosingExpense);
        return response.data;
    } catch (error) {
        console.error("Error updating fixed bus closing expense:", error);
        throw error;
    }
}

// Delete a fixed bus closing expense by ID
export async function deleteFixedBusClosingExpense(id: number): Promise<void> {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting fixed bus closing expense:", error);
        throw error;
    }
}

