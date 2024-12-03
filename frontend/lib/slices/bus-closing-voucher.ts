import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Updated BusClosingVoucher type based on your new requirements
export type BusClosingVoucher = {
  id: number;
  date: string;
  driverId: string;
  conductorId: string;
  busId: string;
  voucherNumber: string;
  commission: number | null;
  diesel: number | null;
  dieselLitres: number | null;
  coilTechnician: number | null;
  toll: number | null;
  cleaning: number | null;
  alliedmor: number | null;
  cityParchi: number | null;
  refreshment: number | null;
  revenue: number | null;
};

// Define the initial state with BusClosingVoucher type
interface BusClosingVoucherState {
  busClosingVouchers: BusClosingVoucher[];
}

// Helper function to generate current ISO DateTime for Date field
const getCurrentISODateTime = (): string => {
  return new Date().toISOString().split('T')[0]; 
};

const initialState: BusClosingVoucherState = {
  busClosingVouchers: [
    {
      id: 1,
      date: getCurrentISODateTime(),
      driverId: '16',
      conductorId: '17',
      busId: '5',
      voucherNumber: '1',
      commission: 5000,
      diesel: 3000,
      dieselLitres: 100,
      coilTechnician: 1000,
      toll: 500,
      cleaning: 200,
      alliedmor: 400,
      cityParchi: 300,
      refreshment: 700,
      revenue: 15000
    },
    {
      id: 2,
      date: getCurrentISODateTime(),
      driverId: '16',
      conductorId: '18',
      busId: '6',
      voucherNumber: '2',
      commission: 4000,
      diesel: 2500,
      dieselLitres: 80,
      coilTechnician: 800,
      toll: 300,
      cleaning: 150,
      alliedmor: 350,
      cityParchi: 200,
      refreshment: 600,
      revenue: 12000
    },
    {
      id: 3,
      date: getCurrentISODateTime(),
      driverId: '16',
      conductorId: '18',
      busId: '13',
      voucherNumber: '3',
      commission: 5500,
      diesel: 3500,
      dieselLitres: 120,
      coilTechnician: 1200,
      toll: 700,
      cleaning: 250,
      alliedmor: 450,
      cityParchi: 400,
      refreshment: 750,
      revenue: 16000
    },
    {
      id: 4,
      date: getCurrentISODateTime(),
      driverId: '16',
      conductorId: '17',
      busId: '14',
      voucherNumber: '4',
      commission: 6000,
      diesel: 4000,
      dieselLitres: 130,
      coilTechnician: 1500,
      toll: 800,
      cleaning: 300,
      alliedmor: 500,
      cityParchi: 450,
      refreshment: 800,
      revenue: 17000
    }
  ]
};

// Create the slice
const busClosingVoucherSlice = createSlice({
  name: 'busClosingVouchers',
  initialState,
  reducers: {
    // Action to add a new BusClosingVoucher
    addBusClosingVoucher: (
      state,
      action: PayloadAction<Omit<BusClosingVoucher, 'id'>>
    ) => {
      const newId =
        state.busClosingVouchers.length > 0
          ? state.busClosingVouchers[state.busClosingVouchers.length - 1].id + 1
          : 1;

      const newBusClosingVoucher: BusClosingVoucher = {
        ...action.payload,
        id: newId,
        date: getCurrentISODateTime()
      };

      state.busClosingVouchers.push(newBusClosingVoucher);
    },

    // Action to remove a BusClosingVoucher by ID
    removeBusClosingVoucher: (state, action: PayloadAction<number>) => {
      state.busClosingVouchers = state.busClosingVouchers.filter(
        (voucher) => voucher.id !== action.payload
      );
    },

    // Action to update an existing BusClosingVoucher by ID
    updateBusClosingVoucher: (
      state,
      action: PayloadAction<BusClosingVoucher>
    ) => {
      const index = state.busClosingVouchers.findIndex(
        (voucher) => voucher.id === action.payload.id
      );
      if (index !== -1) {
        state.busClosingVouchers[index] = action.payload;
      }
    }
  }
});

// Export actions and reducer
export const {
  addBusClosingVoucher,
  removeBusClosingVoucher,
  updateBusClosingVoucher
} = busClosingVoucherSlice.actions;
export default busClosingVoucherSlice.reducer;

// Selector to get all bus closing vouchers
export const allBusClosingVouchers = (state: RootState) =>
  state.busClosingVouchers.busClosingVouchers;
