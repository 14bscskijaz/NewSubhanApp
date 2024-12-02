import axios from 'axios';
import { Employee } from '@/lib/slices/employe-slices';

const baseUrl = 'https://localhost:7169/api';

export async function getAllEmployees() {
    try {
        const response = await axios.get(`${baseUrl}/Employees`);
        console.log(response.data, 'Fetched Employees');
        return response.data;
    } catch (error:any) {
        console.error('Error fetching employees:', error.message);
        throw error;
    }
}

export async function createEmployee(employeeData: Omit<Employee, "id">) {
    try {
        const response = await axios.post(`${baseUrl}/Employees`, employeeData);
        console.log(response.data, 'Created Employee');
        return response.data;
    } catch (error:any) {
        console.error('Error creating employee:', error.message);
        throw error;
    }
}

export async function updateEmployeeAPI(employeeId: number, updatedData: Record<string, any>) {
    try {
        const response = await axios.put(`${baseUrl}/Employees/${employeeId}`, updatedData);
        console.log(response.data, 'Updated Employee');
        return response.data;
    } catch (error:any) {
        console.error('Error updating employee:', error.message);
        throw error;
    }
}

export async function deleteEmployee(employeeId: number) {
    try {
        await axios.delete(`${baseUrl}/Employees/${employeeId}`);
        console.log(`Employee with ID ${employeeId} deleted successfully.`);
    } catch (error:any) {
        console.error('Error deleting employee:', error.message); 1 
        throw error;
    }
}