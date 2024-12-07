import { Buses } from '@/lib/slices/bus-slices';
import axios from 'axios';

const API_BASE_URL = "https://localhost:7169/api/Bus";

export async function getAllBuses(): Promise<Buses[]> {
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

export async function createBus(busData: Omit<Buses, "id">) {
    try {
        // Make the POST request to the API endpoint with the bus data
        const response = await axios.post(API_BASE_URL, busData);

        return response.data;
    } catch (error: any) {
        console.error("Error creating a new bus:", error.message || error);

        throw new Error("Failed to create a new bus. Please try again.");
    }
}

// Function to delete a bus
export async function deleteBus(busId: number): Promise<void> {
    try {
        // Make the DELETE request to the API endpoint
        await axios.delete(`${API_BASE_URL}/${busId}`);

        // No need to return anything, as the response is usually empty for DELETE
        console.log(`Bus with ID ${busId} deleted successfully.`);
    } catch (error: any) {
        // Log the error for debugging purposes
        console.error("Error deleting the bus:", error.message || error);

        // Optional: Customize the error message or rethrow it
        throw new Error("Failed to delete the bus. Please try again.");
    }
}

// Function to update a bus
export async function updateBuses(busId: number, busData: Omit<Buses, "id">): Promise<Buses> {
    try {
        // Make the PUT request to the API endpoint with the updated bus data
        const response = await axios.put(`${API_BASE_URL}/${busId}`, busData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data; // Return the updated bus data
    } catch (error: any) {
        // Log the error for debugging purposes
        console.error("Error updating the bus:", error.message || error);

        // Optional: Customize the error message or rethrow it
        throw new Error("Failed to update the bus. Please try again.");
    }
}
