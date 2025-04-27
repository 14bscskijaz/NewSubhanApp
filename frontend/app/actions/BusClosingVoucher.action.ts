'use server'
import { BusClosingVoucher } from "@/lib/slices/bus-closing-voucher";
import axios from "axios";
import util from 'util';

// const API_BASE_URL = "https://localhost:7169/api/BusClosingVoucher";
const API_BASE_URL  = process.env.NEXT_PUBLIC_BACKEND_URL + "/BusClosingVoucher";

// Create an Axios instance with custom SSL settings
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
});

// Get all bus closing vouchers
export async function getAllBusClosingVouchers(): Promise<BusClosingVoucher[]> {
    try {
        const response = await axiosInstance.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching bus closing vouchers:", error);
        throw error;
    }
}

// Create a new bus closing voucher
export async function createBusClosingVoucher(busClosingVoucher: BusClosingVoucher): Promise<BusClosingVoucher> {
    try {
        const response = await axiosInstance.post(API_BASE_URL, busClosingVoucher);
        
        if (response.status === 201) {
            console.log("Bus closing voucher created successfully.");
        } 
        return response.data;
    } catch (error) {
        console.error("Error creating bus closing voucher:");
        if (error instanceof Error) {
            const axiosError = error as any;
            console.error("Error Message from the server:", axiosError?.response?.data);
            console.error(util.inspect(axiosError?.response?.data?.detail, { depth: null, colors: true }))
        }
        // console.error("Error creating bus closing voucher:", error);
        throw error;
    }
}

// Update an existing bus closing voucher
export async function updateBusClosingVoucher(id: number, updatedBusClosingVoucher: Partial<BusClosingVoucher>): Promise<BusClosingVoucher> {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedBusClosingVoucher);
        return response.data;
    } catch (error) {
        console.error("Error updating bus closing voucher:", error);
        throw error;
    }
}

// Delete a bus closing voucher by ID
export async function deleteBusClosingVoucher(id: number): Promise<void> {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting bus closing voucher:", error);
        throw error;
    }
}

