import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Updated BusClosingVoucher type based on your new requirements
export type BusClosingVoucher = {
  id: number;
  date: string;
  driverId: number;
  conductorId: number | null;
  busId: number;
  voucherNumber: number;
  commission: number | null;
  diesel: number | null;
  dieselLitres: number | null;
  cOilTechnician: number | null;
  toll: number | null;
  cleaning: number | null;
  alliedmor: number | null;
  cityParchi: number | null;
  refreshment: number | null;
  revenue: number | null;
  generator:number | null;
  miscellaneousExpense:number | null;
  repair:number | null;
  explanation:string;
  routeId?: number;
  isSubmitted?: boolean;
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
  busClosingVouchers: []
};

// Create the slice
const busClosingVoucherSlice = createSlice({
  name: 'busClosingVouchers',
  initialState,
  reducers: {
    setBusClosingVoucher: (
      state,
      action: PayloadAction<Omit<BusClosingVoucher[], 'id'>>
    ) => {
      state.busClosingVouchers = action.payload;
    },
    // Action to add a new BusClosingVoucher
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

      // Push the new voucher to the state (mutating the state directly)
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
  updateBusClosingVoucher,
  setBusClosingVoucher
} = busClosingVoucherSlice.actions;
export default busClosingVoucherSlice.reducer;

// Selector to get all bus closing vouchers
export const allBusClosingVouchers = (state: RootState) =>
  state.busClosingVouchers.busClosingVouchers;
