import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';

// Define the Employee type with Date fields instead of ISO strings
export type Employee = {
  id: string;
  cnic: string;
  firstName: string;
  lastName: string;
  employeeType: string;
  address: string;
  mobileNumber: string;
  hireDate: Date | null;
  employeeStatus: string;
  dob: Date | null;
  notes: string;
};

// Define the state interface
interface EmployeeState {
  employees: Employee[];
}

// Initial state with Date objects instead of ISO strings
const initialState: EmployeeState = {
  employees: [
    // {
    //   id: uuidv4(),
    //   cnic: '12345-6789012-3',
    //   firstName: 'Muhammad',
    //   lastName: 'Rashid',
    //   employeeType: 'Driver',
    //   address: '123 Main St, Cityville',
    //   mobileNumber: '555-1234',
    //   hireDate: new Date('2023-01-15T00:00:00.000Z'),
    //   employeeStatus: 'Active',
    //   dob: new Date('1990-05-20T00:00:00.000Z'),
    //   notes: 'Experienced in project management.',
    // },
    // {
    //   id: uuidv4(),
    //   cnic: '98765-4321098-7',
    //   firstName: 'Fawad',
    //   lastName: 'Kaleem',
    //   employeeType: 'Conductor',
    //   address: '456 Oak Ave, Townsville',
    //   mobileNumber: '555-5678',
    //   hireDate: new Date('2022-06-10T00:00:00.000Z'),
    //   employeeStatus: 'On Leave',
    //   dob: new Date('1985-10-11T00:00:00.000Z'),
    //   notes: 'Specializes in customer support.',
    // },
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
        hireDate: action.payload.hireDate ? new Date(action.payload.hireDate) : null,
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
          hireDate: action.payload.hireDate ? new Date(action.payload.hireDate) : null,
          dob: action.payload.dob ? new Date(action.payload.dob) : null,
        };
      }
    },
    setEmployee: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
  },
});

// Export actions and reducer
export const { addEmployee, removeEmployee, updateEmployee,setEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;

// Selector to get all employees
export const allEmployees = (state: RootState) => state.employees.employees;
