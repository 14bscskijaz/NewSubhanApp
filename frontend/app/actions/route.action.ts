import { Route } from "@/lib/slices/route-slices";
import axios from "axios";

const API_BASE_URL = "https://localhost:7169/api/Route";

export async function getAllRoutes(): Promise<Route[]> {
    try {
        // Make the request with axios
        const response = await axios.get(API_BASE_URL);

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
        const response = await axios.post(API_BASE_URL, route);
        return response.data;
    } catch (error) {
        console.error("Error creating route:", error);
        throw error;
    }
}

// Function to update an existing route
export async function updatedRoutes(id: number, updatedRoute: Partial<Route>): Promise<Route> {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, updatedRoute);
        return response.data;
    } catch (error) {
        console.error("Error updating route:", error);
        throw error;
    }
}

// Function to delete a route
export async function deleteRoute(id: number): Promise<void> {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting route:", error);
        throw error;
    }
}