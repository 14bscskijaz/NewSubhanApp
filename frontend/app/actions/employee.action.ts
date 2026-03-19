'use server'
import axios from 'axios';
import { Employee } from '@/lib/slices/employe-slices';

// const API_BASE_URL = 'http://localhost:7169/api';
const API_BASE_URL  = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    httpsAgent: new (require('http').Agent)({
        rejectUnauthorized: false,
    }),
});

function getErrorMessage(error: any, fallbackMessage: string) {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (typeof responseData === "string" && responseData.trim()) {
            return responseData;
        }

        if (typeof responseData?.message === "string" && responseData.message.trim()) {
            return responseData.message;
        }

        if (typeof responseData?.title === "string" && responseData.title.trim()) {
            return responseData.title;
        }
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallbackMessage;
}

export async function getAllEmployees() {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/Employees`);
        return response.data;
    } catch (error:any) {
        console.error('Error fetching employees:', error.message);
        throw error;
    }
}

export async function createEmployee(employeeData: Omit<Employee, "id">) {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/Employees`, employeeData);
        return response.data;
    } catch (error:any) {
        const message = getErrorMessage(error, "Failed to create employee.");
        console.error('Error creating employee:', message);
        throw new Error(message);
    }
}

export async function updateEmployeeAPI(employeeId: number, updatedData: Record<string, any>) {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/Employees/${employeeId}`, updatedData);
        return response.data;
    } catch (error:any) {
        console.error('Error updating employee:', error.message);
        throw error;
    }
}

export async function deleteEmployee(employeeId: number) {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/Employees/${employeeId}`);
    } catch (error:any) {
        console.error('Error deleting employee:', error.message); 1 
        throw error;
    }
}
