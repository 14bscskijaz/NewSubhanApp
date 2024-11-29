// 'use server'

import axios from 'axios';

export async function  getAllBuses() {
    try {
        // Make the request with axios
        const response = await axios.get("https://localhost:7169/api/Bus");

        // Extract the data from the response
        const data = await response.data;

        // Return the data
        return data;
    } catch (error) {
        // Handle errors
        console.error("Error fetching buses:", error);
        throw error;  // Optional: You can rethrow the error or handle it in another way
    }
}
