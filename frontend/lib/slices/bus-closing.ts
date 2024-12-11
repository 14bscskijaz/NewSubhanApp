import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
// TODO: rename to tripclosing
// Updated BusClosing type
export type BusClosing = {
  date: string | Date;
  busId: string,
  voucherNumber: string,
  driverId: string,
  conductorId?: string
  routeId: string
};

// Define the initial state
interface BusClosingState {
  busClosings: BusClosing[];
}

const initialState: BusClosingState = {
  busClosings: []
};

// Helper function to generate current ISO DateTime
const getCurrentISODateTime = (): string => {
  return new Date().toISOString();
};

// Create the slice
const busClosingSlice = createSlice({
  name: 'busClosings',
  initialState,
  reducers: {
    addBusClosing: (
      state,
      action: PayloadAction<BusClosing>
    ) => {
      if (state.busClosings.length > 0) {
        state.busClosings[0] = action.payload; 
      } else {
        state.busClosings.push(action.payload);
      }
    },
    setBusClosing: (
      state,
      action: PayloadAction<BusClosing[]>
    ) => {
      state.busClosings = []
    }
  }
});

// Export actions and reducer
export const { addBusClosing,setBusClosing } =
  busClosingSlice.actions;
export default busClosingSlice.reducer;

// Selector to get all bus closings
export const allBusClosings = (state: RootState) =>
  state.busClosings.busClosings;
