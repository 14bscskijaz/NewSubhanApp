import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { v4 as uuidv4 } from 'uuid';

// Define the BusReport type
export type BusReport = {
  id: string;
  srNo: number;
  busNumber: number;
  passengersMonthWise: number;
  revenue: number;
};

// Define the state interface
interface BusReportState {
  reports: BusReport[];
}

// Initial state
const initialState: BusReportState = {
  reports: [
    {
      id: uuidv4(),
      srNo: 1,
      busNumber: 101,
      passengersMonthWise: 120,
      revenue: 50000,
    },
    {
      id: uuidv4(),
      srNo: 2,
      busNumber: 202,
      passengersMonthWise: 80,
      revenue: 40000,
    },
    {
      id: uuidv4(),
      srNo: 3,
      busNumber: 303,
      passengersMonthWise: 150,
      revenue: 60000,
    },
    {
      id: uuidv4(),
      srNo: 4,
      busNumber: 404,
      passengersMonthWise: 90,
      revenue: 45000,
    },
    {
      id: uuidv4(),
      srNo: 5,
      busNumber: 505,
      passengersMonthWise: 200,
      revenue: 80000,
    },
    {
      id: uuidv4(),
      srNo: 6,
      busNumber: 606,
      passengersMonthWise: 75,
      revenue: 35000,
    },
  ],
};

// Create the slice
const busReportSlice = createSlice({
  name: 'busReport',
  initialState,
  reducers: {
    addBusReport: (state, action: PayloadAction<Omit<BusReport, 'id'>>) => {
      const newReport: BusReport = {
        ...action.payload,
        id: uuidv4(),
      };
      state.reports.push(newReport);
    },
    removeBusReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter((report) => report.id !== action.payload);
    },
    updateBusReport: (state, action: PayloadAction<BusReport>) => {
      const index = state.reports.findIndex((report) => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    setBusReports: (state, action: PayloadAction<BusReport[]>) => {
      state.reports = action.payload;
    },
  },
});

// Export actions and reducer
export const { addBusReport, removeBusReport, updateBusReport, setBusReports } = busReportSlice.actions;
export default busReportSlice.reducer;

// Selector to get all bus reports
export const allBusReports = (state: RootState) => state.busReport.reports;
