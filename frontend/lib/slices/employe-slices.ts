import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';

// Define the Employee type with Date fields instead of ISO strings
export type Employee = {
  id: string;
  cnic: string;
  first_name: string;
  last_name: string;
  employee_type: string;
  address: string;
  mobile_number: string;
  hire_date: Date | null; // Date object
  employee_status: string;
  dob: Date | null; // Date object
  notes: string;
};

// Define the state interface
interface EmployeeState {
  employees: Employee[];
}

// Initial state with Date objects instead of ISO strings
const initialState: EmployeeState = {
  employees: [
    {
      id: uuidv4(),
      cnic: '12345-6789012-3',
      first_name: 'Muhammad',
      last_name: 'Rashid',
      employee_type: 'Driver',
      address: '123 Main St, Cityville',
      mobile_number: '555-1234',
      hire_date: new Date('2023-01-15T00:00:00.000Z'),
      employee_status: 'Active',
      dob: new Date('1990-05-20T00:00:00.000Z'),
      notes: 'Experienced in project management.',
    },
    {
      id: uuidv4(),
      cnic: '98765-4321098-7',
      first_name: 'Fawad',
      last_name: 'Kaleem',
      employee_type: 'Conductor',
      address: '456 Oak Ave, Townsville',
      mobile_number: '555-5678',
      hire_date: new Date('2022-06-10T00:00:00.000Z'),
      employee_status: 'On Leave',
      dob: new Date('1985-10-11T00:00:00.000Z'),
      notes: 'Specializes in customer support.',
    },
  ],
};

// Create the slice
const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Omit<Employee, 'id'>>) => {
      const newEmployee: Employee = {
        ...action.payload,
        id: uuidv4(),
        hire_date: action.payload.hire_date ? new Date(action.payload.hire_date) : null,
        dob: action.payload.dob ? new Date(action.payload.dob) : null,
      };
      state.employees.push(newEmployee);
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((employee) => employee.id !== action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex((employee) => employee.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = {
          ...action.payload,
          hire_date: action.payload.hire_date ? new Date(action.payload.hire_date) : null,
          dob: action.payload.dob ? new Date(action.payload.dob) : null,
        };
      }
    },
  },
});

// Export actions and reducer
export const { addEmployee, removeEmployee, updateEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;

// Selector to get all employees
export const allEmployees = (state: RootState) => state.employees.employees;
