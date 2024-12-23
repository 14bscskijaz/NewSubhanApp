'use server'
import { TicketPriceRaw, TicketPriceRawEdit } from "@/lib/slices/pricing-slices";
import axios from "axios";

// const API_BASE_URL = "https://localhost:7169/api/TicketPricing";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/TicketPricing";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
});

// Get all ticket prices
export async function getAllTicketPrices(): Promise<TicketPriceRaw[]> {
    try {
        const response = await axiosInstance.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching ticket prices:", error);
        throw error;
    }
}

// Create a new ticket price
export async function createTicketPrice(ticketPrice: Omit<TicketPriceRaw,"id">): Promise<Omit<TicketPriceRaw,"id">> {
    try {
        const response = await axiosInstance.post(API_BASE_URL, ticketPrice);
        return response.data;
    } catch (error) {
        console.error("Error creating ticket price:", error);
        throw error;
    }
}

// Update an existing ticket price
export async function updateTicketPrice(id: number, updatedTicketPrice: Partial<TicketPriceRawEdit>): Promise<TicketPriceRawEdit> {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedTicketPrice);
        return response.data;
    } catch (error) {
        console.error("Error updating ticket price:", error);
        throw error;
    }
}

// Delete a ticket price by ID
export async function deleteTicketPrice(id: number): Promise<void> {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting ticket price:", error);
        throw error;
    }
}
