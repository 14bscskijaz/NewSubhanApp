import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the Expense type based on the updated schema
export type Expense = {
  id: number;
  date: string;
  type: 'bus' | 'general';
  busClosingVoucherId?: number | null;
  busId?: number;
  routeId?: number;
  amount: number;
  description: string;
  originalId?: number; // Make sure originalId is included
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
const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    // Action to add a new expense with auto-incremented ID
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
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
    removeExpense: (state, action: PayloadAction<number>) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
    },

    // Action to update an expense by ID
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },

    // Action to set the entire state
    setExpenses: (state, action: PayloadAction<Omit<Expense, 'id'>[]>) => {
      // Manually add id and type for each expense in the filtered data
      state.expenses = action.payload.map((expense, index) => ({
        ...expense,
        id: index + 1,
        originalId: expense.originalId,
      }));
    }
  }
});

// Export actions and reducer
export const { addExpense, removeExpense, updateExpense, setExpenses } =
  expenseSlice.actions;
export default expenseSlice.reducer;

// Selector to get all expenses
export const allExpenses = (state: RootState) => state.expenses.expenses;
