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

export async function getAllEmployees() {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/Employees`);
        // console.log(response.data, 'Fetched Employees');
        return response.data;
    } catch (error:any) {
        console.error('Error fetching employees:', error.message);
        throw error;
    }
}

export async function createEmployee(employeeData: Omit<Employee, "id">) {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/Employees`, employeeData);
        console.log(response.data, 'Created Employee');
        return response.data;
    } catch (error:any) {
        console.error('Error creating employee:', error.message);
        throw error;
    }
}

export async function updateEmployeeAPI(employeeId: number, updatedData: Record<string, any>) {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/Employees/${employeeId}`, updatedData);
        console.log(response.data, 'Updated Employee');
        return response.data;
    } catch (error:any) {
        console.error('Error updating employee:', error.message);
        throw error;
    }
}

export async function deleteEmployee(employeeId: number) {
    try {
        await axiosInstance.delete(`${API_BASE_URL}/Employees/${employeeId}`);
        console.log(`Employee with ID ${employeeId} deleted successfully.`);
    } catch (error:any) {
        console.error('Error deleting employee:', error.message); 1 
        throw error;
    }
}