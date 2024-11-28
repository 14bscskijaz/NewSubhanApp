import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type TripInformation = {
  id: number;
  routeClosingVoucherId: string;
  routeId: string | undefined;
  passengerCount: string; // Auto
  fullTicketBusinessCount: string;
  fullTicketCount: string;
  halfTicketCount: string;
  freeTicketCount: string;
  actualRevenue: string; // Auto
  miscellaneousAmount: string;
  revenueDiffExplanation: string;
};

export type TripInformationInput = TripInformation & {
  // These are collected from frontend but for backend and database
  // we use these to identify the routeId
  sourceStation: string;
  destinationStation: string;
};

// Define state interface
interface TripInformationState {
  tripsInformation: TripInformation[];
}

// Define the initial state
const initialState: TripInformationState = {
  tripsInformation: [
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
const tripInformationSlice = createSlice({
  name: 'tripsInformation',
  initialState,
  reducers: {
    addTripInformation: (
      state,
      action: PayloadAction<Omit<TripInformation, 'id'>>
    ) => {
      const newId =
        state.tripsInformation.length > 0
          ? state.tripsInformation[state.tripsInformation.length - 1].id + 1
          : 1;

      const newTripInformation: TripInformation = {
        ...action.payload,
        id: newId
      };

      state.tripsInformation.push(newTripInformation);
    },

    // Action to remove a bus closing by ID
    removeTripInformation: (state, action: PayloadAction<number>) => {
      state.tripsInformation = state.tripsInformation.filter(
        (tripInformation) => tripInformation.id !== action.payload
      );
    },

    // Action to update a bus closing by ID
    updateTripInformation: (state, action: PayloadAction<TripInformation>) => {
      const index = state.tripsInformation.findIndex(
        (tripInformation) => tripInformation.id === action.payload.id
      );
      if (index !== -1) {
        state.tripsInformation[index] = action.payload;
      }
    }
  }
});

// Export actions and reducer
export const {
  addTripInformation,
  removeTripInformation,
  updateTripInformation
} = tripInformationSlice.actions;
export default tripInformationSlice.reducer;

// Selector to get all bus closings
export const allTripsInformation = (state: RootState) =>
  state.tripsInformation.tripsInformation;
