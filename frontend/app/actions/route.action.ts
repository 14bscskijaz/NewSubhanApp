'use server'
import { Route } from "@/lib/slices/route-slices";
import axios from "axios";

// const API_BASE_URL = "https://localhost:7169/api/Route";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/Route";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
});

export async function getAllRoutes(): Promise<Route[]> {
    try {
        // Make the request with axios
        const response = await axiosInstance.get(API_BASE_URL);

        // Extract the data from the response
        const data = await response.data;

        return data;
    } catch (error) {
        // Handle errors
        console.error("Error fetching buses:", error);
        throw error;
    }
}

// Function to create a new route
export async function createRoute(route: Omit<Route,"id">) {
    try {
        const response = await axiosInstance.post(API_BASE_URL, route);
        return response.data;
    } catch (error) {
        console.error("Error creating route:", error);
        throw error;
    }
}

// Function to update an existing route
export async function updatedRoutes(id: number, updatedRoute: Partial<Route>): Promise<Route> {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedRoute);
        return response.data;
    } catch (error) {
        console.error("Error updating route:", error);
        throw error;
    }
}

// Function to delete a route
export async function deleteRoute(id: number): Promise<void> {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting route:", error);
        throw error;
    }
}