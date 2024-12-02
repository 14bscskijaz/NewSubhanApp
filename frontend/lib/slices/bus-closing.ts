import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
// TODO: rename to tripclosing
// Updated BusClosing type
export type BusClosing = {
  id: number;
  routeClosingVoucherId: string;
  routeId: string | undefined;
  passengerCount: string;
  fullTicketCount: string;
  halfTicketCount: string;
  freeTicketCount: string;
  revenue: string;
  revenueDiffExplanation: string;
  departureTime: string;
  
};

// Define the initial state
interface BusClosingState {
  busClosings: BusClosing[];
}

const initialState: BusClosingState = {
  busClosings: [
    // {
    //   id: 1,
    //   routeClosingVoucherId: 1,
    //   routeId: 1,
    //   passengerCount: 40,
    //   fullTicketCount: 35,
    //   halfTicketCount: 5,
    //   freeTicketCount: 0,
    //   revenue: 2000,
    //   revenueDiffExplanation: '',
    //   departureTime: '2024-11-20T08:00:00Z',
    //   source: 'City A',
    //   sourceStation: 'Station A1',
    //   destination: 'City B',
    //   destinationStation: 'Station B1',
    // },
    // {
    //   id: 2,
    //   routeClosingVoucherId: 2,
    //   routeId: 2,
    //   passengerCount: 50,
    //   fullTicketCount: 40,
    //   halfTicketCount: 5,
    //   freeTicketCount: 5,
    //   revenue: 3000,
    //   revenueDiffExplanation: 'Promotion tickets issued.',
    //   departureTime: '2024-11-21T10:00:00Z',
    //   source: 'City C',
    //   sourceStation: 'Station C1',
    //   destination: 'City D',
    //   destinationStation: 'Station D1',
    // },
  ]
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
      action: PayloadAction<Omit<BusClosing, 'id' | 'departureTime'>>
    ) => {
      const newId =
        state.busClosings.length > 0
          ? state.busClosings[state.busClosings.length - 1].id + 1
          : 1;

      const newBusClosing: BusClosing = {
        ...action.payload,
        id: newId,
        departureTime: getCurrentISODateTime()
      };

      state.busClosings.push(newBusClosing);
    },

    // Action to remove a bus closing by ID
    removeBusClosing: (state, action: PayloadAction<number>) => {
      state.busClosings = state.busClosings.filter(
        (busClosing) => busClosing.id !== action.payload
      );
    },

    // Action to update a bus closing by ID
    updateBusClosing: (state, action: PayloadAction<BusClosing>) => {
      const index = state.busClosings.findIndex(
        (busClosing) => busClosing.id === action.payload.id
      );
      if (index !== -1) {
        state.busClosings[index] = action.payload;
      }
    }
  }
});

// Export actions and reducer
export const { addBusClosing, removeBusClosing, updateBusClosing } =
  busClosingSlice.actions;
export default busClosingSlice.reducer;

// Selector to get all bus closings
export const allBusClosings = (state: RootState) =>
  state.busClosings.busClosings;
