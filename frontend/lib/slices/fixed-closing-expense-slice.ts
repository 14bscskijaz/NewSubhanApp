import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type ClosingExpense = {
  id: number;
  routeId: number;
  driverCommission: number;
  coilExpense: number;
  tollTax: number;
  halfSafai: number;
  fullSafai: number;
  dcParchi: number;
  alliedMorde: number;
  refreshmentRate: number;
};

interface ClosingExpenseState {
  closingExpenses: ClosingExpense[];
}

const initialState: ClosingExpenseState = {
  closingExpenses: [
    {
      id: 1,
      routeId: 1,
      driverCommission: 500,
      coilExpense: 300,
      tollTax: 100,
      halfSafai: 50,
      fullSafai: 0,
      refreshmentRate: 75,
      dcParchi: 200,
      alliedMorde: 120
    },
    {
      id: 2,
      routeId: 2,
      driverCommission: 600,
      coilExpense: 350,
      tollTax: 120,
      halfSafai: 60,
      fullSafai: 0,
      refreshmentRate: 80,
      dcParchi: 250,
      alliedMorde: 150
    },
    {
      id: 3,
      routeId: 3,
      driverCommission: 700,
      coilExpense: 400,
      tollTax: 150,
      halfSafai: 70,
      fullSafai: 1,
      refreshmentRate: 90,
      dcParchi: 300,
      alliedMorde: 200
    }
  ]
};

const closingExpenseSlice = createSlice({
  name: 'closingExpenses',
  initialState,
  reducers: {
    addClosingExpense: (
      state,
      action: PayloadAction<Omit<ClosingExpense, 'id'>>
    ) => {
      const newId =
        state.closingExpenses.length > 0
          ? state.closingExpenses[state.closingExpenses.length - 1].id + 1
          : 1;
      const newClosingExpense: ClosingExpense = {
        ...action.payload,
        id: newId
      };
      state.closingExpenses.push(newClosingExpense);
    },
    removeClosingExpense: (state, action: PayloadAction<number>) => {
      state.closingExpenses = state.closingExpenses.filter(
        (closingExpense) => closingExpense.id !== action.payload
      );
    },
    updateClosingExpense: (state, action: PayloadAction<ClosingExpense>) => {
      const index = state.closingExpenses.findIndex(
        (closingExpense) => closingExpense.id === action.payload.id
      );
      if (index !== -1) {
        state.closingExpenses[index] = action.payload;
      }
    }
  }
});

export const { addClosingExpense, removeClosingExpense, updateClosingExpense } =
  closingExpenseSlice.actions;
export default closingExpenseSlice.reducer;

export const allClosingExpenses = (state: RootState) =>
  state.closingExpenses.closingExpenses;
