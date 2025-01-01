import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the Expense type based on the updated schema
export type Expense = {
  id: number; // Serial
  date: string; // Date
  type: 'bus' | 'general';
  busClosingVoucherId?: number | null ; // Foreign key
  busId?: number;
  routeId?:number; // Foreign key
  amount: number; // Integer
  description: string; // Varchar(255)
};

// Define the state interface
interface ExpenseState {
  expenses: Expense[];
}

// Initialize the state with sample data
const initialState: ExpenseState = {
  expenses: []
};

// Create the slice
const savedExpenseSlice = createSlice({
  name: 'savedExpense',
  initialState,
  reducers: {
    // Action to add a new expense with auto-incremented ID
    addSavedExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
      const newId =
        state.expenses.length > 0
          ? state.expenses[state.expenses.length - 1].id + 1
          : 1;
      const newExpense: Expense = {
        ...action.payload,
        id: newId,
        busClosingVoucherId: action.payload.busClosingVoucherId,
      };
      state.expenses.push(newExpense);
    },



    // Action to remove an expense by ID
    removeSavedExpense: (state, action: PayloadAction<number>) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
    },

    // Action to update an expense by ID
    updateSavedExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },

    // Action to set the entire state
    setSavedExpenses: (state, action: PayloadAction<Expense[]>) => {
      // Manually add id and type for each expense in the filtered data
      state.expenses = action.payload.map((expense, index) => ({
        ...expense,
        id: index + 1,
        type: 'bus',
        busClosingVoucherId: expense.busClosingVoucherId ?? null,
      }));
    }
  }
});

// Export actions and reducer
export const { addSavedExpense, removeSavedExpense, updateSavedExpense, setSavedExpenses } =
  savedExpenseSlice.actions;
export default savedExpenseSlice.reducer;

// Selector to get all expenses
export const allSavedExpenses = (state: RootState) => state.savedExpense.expenses;
