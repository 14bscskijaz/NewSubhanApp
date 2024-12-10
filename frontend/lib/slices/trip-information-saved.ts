import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type SavedTripInformation = {
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

export type SavedTripInformationInput = SavedTripInformation & {
  sourceStation: string;
  destinationStation: string;
};

// Define state interface
interface SavedTripInformationState {
  savedTripsInformation: SavedTripInformation[];
}

// Define the initial state
const initialState: SavedTripInformationState = {
  savedTripsInformation: [
    // {
    //   id: 1,
    //   routeClosingVoucherId: "1",
    //   routeId: "3",
    //   passengerCount: "40",
    //   fullTicketCount: "35",
    //   halfTicketCount: "5",
    //   freeTicketCount: "0",
    //   actualRevenue: "2000",
    //   revenueDiffExplanation: 'hello',
    //   miscellaneousAmount: "12",
    //   fullTicketBusinessCount: '1'
    // },
    // {
    //   id: 2,
    //   routeClosingVoucherId: "2",
    //   routeId: "4",
    //   passengerCount: "50",
    //   fullTicketCount: "40",
    //   halfTicketCount: "5",
    //   freeTicketCount: "5",
    //   actualRevenue: "3000",
    //   revenueDiffExplanation: 'Promotion tickets issued.',
    //   fullTicketBusinessCount: '1',
    //   miscellaneousAmount: '12'
    // },
    // {
    //   id: 3,
    //   routeClosingVoucherId: "3",
    //   routeId: "6",
    //   passengerCount: "50",
    //   fullTicketCount: "40",
    //   halfTicketCount: "5",
    //   freeTicketCount: "5",
    //   actualRevenue: "3000",
    //   revenueDiffExplanation: 'Promotion tickets issued.',
    //   fullTicketBusinessCount: '1',
    //   miscellaneousAmount: '12'
    // },
    // {
    //   id: 4,
    //   routeClosingVoucherId: "4",
    //   routeId: "7",
    //   passengerCount: "50",
    //   fullTicketCount: "40",
    //   halfTicketCount: "5",
    //   freeTicketCount: "5",
    //   actualRevenue: "3000",
    //   revenueDiffExplanation: 'Promotion tickets issued.',
    //   fullTicketBusinessCount: '1',
    //   miscellaneousAmount: '12'
    // },
  ]
};

// Helper function to generate current ISO DateTime
const getCurrentISODateTime = (): string => {
  return new Date().toISOString();
};

// Create the slice
const savedTripInformationSlice = createSlice({
  name: 'savedTripsInformation',
  initialState,
  reducers: {
    addSavedTripInformation: (
      state,
      action: PayloadAction<Omit<SavedTripInformation, 'id'>>
    ) => {
      const newId =
        state.savedTripsInformation.length > 0
          ? state.savedTripsInformation[state.savedTripsInformation.length - 1].id + 1
          : 1;

      const newTripInformation: SavedTripInformation = {
        ...action.payload,
        id: newId
      };

      state.savedTripsInformation.push(newTripInformation);
    },

    // Action to remove a bus closing by ID
    removeSavedTripInformation: (state, action: PayloadAction<number>) => {
      state.savedTripsInformation = state.savedTripsInformation.filter(
        (tripInformation) => tripInformation.id !== action.payload
      );
    },

    // Action to update a bus closing by ID
    updateSavedTripInformation: (state, action: PayloadAction<SavedTripInformation>) => {
      const index = state.savedTripsInformation.findIndex(
        (tripInformation) => tripInformation.id === action.payload.id
      );
      if (index !== -1) {
        state.savedTripsInformation[index] = action.payload;
      }
    }
  }
});

// Export actions and reducer
export const {
  addSavedTripInformation,
  removeSavedTripInformation,
  updateSavedTripInformation
} = savedTripInformationSlice.actions;
export default savedTripInformationSlice.reducer;

// Selector to get all bus closings
export const allSavedsavedTripsInformation = (state: RootState) =>
  state.savedTripsInformation.savedTripsInformation;
