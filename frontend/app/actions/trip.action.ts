'use server'
import { TripInformation } from "@/lib/slices/trip-information";
import axios, { AxiosError } from "axios";

// const API_BASE_URL = "https://localhost:7169/api/Trip";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/Trip";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
});

// Get all trips
export async function getAllTrips(): Promise<TripInformation[]> {
    try {
        const response = await axiosInstance.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching trips:", error);
        throw error;
    }
}

// Get a single trip by ID
export async function getTripById(id: number): Promise<TripInformation> {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching trip with id ${id}:`, error);
        throw error;
    }
}

// Create a new trip
export async function createTrip(trip: Omit<TripInformation, 'id'>): Promise<Omit<TripInformation, 'id'>> {
    try {
        const response = await axiosInstance.post(API_BASE_URL, trip);
        return response.data;
    } catch (error) {
        console.error("Error creating trip:", error);
        // console.error("Error Message: ", error?.data?.errors)
        throw error;
    }
}

// Update an existing trip
export async function updateTrip(id: number, updatedTrip: Partial<TripInformation>): Promise<TripInformation> {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedTrip);
        return response.data;
    } catch (error) {
        console.error(`Error updating trip with id ${id}:`, error);
        throw error;
    }
}

// Delete a trip by ID
export async function deleteTrip(id: number): Promise<void> {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting trip with id ${id}:`, error);
        throw error;
    }
}

