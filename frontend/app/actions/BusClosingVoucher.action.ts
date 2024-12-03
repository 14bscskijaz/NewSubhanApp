import { BusClosingVoucher } from "@/lib/slices/bus-closing-voucher";
import axios from "axios";

const API_BASE_URL = "https://localhost:7169/api/BusClosingVoucher";

// Get all bus closing vouchers
export async function getAllBusClosingVouchers(): Promise<BusClosingVoucher[]> {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching bus closing vouchers:", error);
        throw error;
    }
}

// Create a new bus closing voucher
export async function createBusClosingVoucher(busClosingVoucher: BusClosingVoucher): Promise<BusClosingVoucher> {
    try {
        const response = await axios.post(API_BASE_URL, busClosingVoucher);
        return response.data;
    } catch (error) {
        console.error("Error creating bus closing voucher:", error);
        throw error;
    }
}

// Update an existing bus closing voucher
export async function updateBusClosingVoucher(id: number, updatedBusClosingVoucher: Partial<BusClosingVoucher>): Promise<BusClosingVoucher> {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, updatedBusClosingVoucher);
        return response.data;
    } catch (error) {
        console.error("Error updating bus closing voucher:", error);
        throw error;
    }
}

// Delete a bus closing voucher by ID
export async function deleteBusClosingVoucher(id: number): Promise<void> {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting bus closing voucher:", error);
        throw error;
    }
}

