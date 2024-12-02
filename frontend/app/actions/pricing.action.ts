import { TicketPriceRaw } from "@/lib/slices/pricing-slices";
import axios from "axios";

const API_BASE_URL = "https://localhost:7169/api/TicketPricing";

// Get all ticket prices
export async function getAllTicketPrices(): Promise<TicketPriceRaw[]> {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching ticket prices:", error);
        throw error;
    }
}

// Create a new ticket price
export async function createTicketPrice(ticketPrice: TicketPriceRaw): Promise<TicketPriceRaw> {
    try {
        const response = await axios.post(API_BASE_URL, ticketPrice);
        return response.data;
    } catch (error) {
        console.error("Error creating ticket price:", error);
        throw error;
    }
}

// Update an existing ticket price
export async function updateTicketPrice(id: number, updatedTicketPrice: Partial<TicketPriceRaw>): Promise<TicketPriceRaw> {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, updatedTicketPrice);
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
