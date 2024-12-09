import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the Trip type based on your schema
export type FixedTripExpense = {
  id: number;
  routeId: number;
  routeCommission: number;
  rewardCommission: number;
  steward: number;
  counter: number;
  dcParchi: number;
  refreshment: number;
  driverCommission:number;
  isPercentage?:boolean;
};

// Define the TripState interface
interface FixedTripExpenseState {
  fixedTripExpenses: FixedTripExpense[];
}

// Initialize the state with sample data
const initialState: FixedTripExpenseState = {
  fixedTripExpenses: [
    {
      id: 1,
      routeId: 1,
      routeCommission: 200,
      rewardCommission: 150,
      steward: 50,
      counter: 100,
      dcParchi: 0,
      refreshment: 75,
      driverCommission:5,
      isPercentage:true
    },
    {
      id: 2,
      routeId: 2,
      routeCommission: 250,
      rewardCommission: 175,
      steward: 60,
      counter: 110,
      dcParchi: 0,
      refreshment: 80,
      driverCommission:5,
      isPercentage:true
    },
    {
      id: 3,
      routeId: 3,
      routeCommission: 300,
      rewardCommission: 200,
      steward: 70,
      counter: 120,
      dcParchi: 50,
      refreshment: 90,
      driverCommission:5,
      isPercentage:true
    }
  ]
};

// Create the TripSlice
const fixedTripExpenseSlice = createSlice({
  name: 'fixedTripExpense',
  initialState,
  reducers: {
    setFixedTripExpense: (
      state,
      action: PayloadAction<Omit<FixedTripExpense[], 'id'>>
    ) => {
      state.fixedTripExpenses = action.payload
    },

    // Action to add a trip with auto-incremented ID
    addFixedTripExpense: (
      state,
      action: PayloadAction<Omit<FixedTripExpense, 'id'>>
    ) => {
      const newId =
        state.fixedTripExpenses.length > 0
          ? state.fixedTripExpenses[state.fixedTripExpenses.length - 1].id + 1
          : 1;
      const newFixedTripExpense: FixedTripExpense = {
        ...action.payload,
        id: newId
      };
      state.fixedTripExpenses.push(newFixedTripExpense);
    },

    // Action to remove a trip by ID
    removeFixedTripExpense: (state, action: PayloadAction<number>) => {
      state.fixedTripExpenses = state.fixedTripExpenses.filter(
        (trip) => trip.id !== action.payload
      );
    },

    // Action to update a trip by ID
    updateFixedTripExpense: (
      state,
      action: PayloadAction<FixedTripExpense>
    ) => {
      const index = state.fixedTripExpenses.findIndex(
        (fixedTripExpense) => fixedTripExpense.id === action.payload.id
      );
      if (index !== -1) {
        state.fixedTripExpenses[index] = action.payload;
      }
    }
  }
});

// Export actions and reducer
export const {
  setFixedTripExpense,
  addFixedTripExpense,
  removeFixedTripExpense,
  updateFixedTripExpense
} = fixedTripExpenseSlice.actions;
export default fixedTripExpenseSlice.reducer;

// Selector to get all fixedTripExpenses
export const allFixedTripExpenses = (state: RootState) =>
  state.fixedTripExpenses.fixedTripExpenses;
