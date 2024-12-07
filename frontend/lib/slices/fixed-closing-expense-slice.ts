import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type ClosingExpense = {
  id: number;
  routeId: number;
  driverCommission: number;
  cOilExpense: number;
  tollTax: number;
  halfSafai: number;
  fullSafai: number;
  dcPerchi: number;
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
      routeId: 3,
      driverCommission: 500,
      cOilExpense: 300,
      tollTax: 100,
      halfSafai: 50,
      fullSafai: 0,
      refreshmentRate: 75,
      dcPerchi: 200,
      alliedMorde: 120
    },
    {
      id: 2,
      routeId: 3,
      driverCommission: 600,
      cOilExpense: 350,
      tollTax: 120,
      halfSafai: 60,
      fullSafai: 0,
      refreshmentRate: 80,
      dcPerchi: 250,
      alliedMorde: 150
    },
    {
      id: 3,
      routeId: 3,
      driverCommission: 700,
      cOilExpense: 400,
      tollTax: 150,
      halfSafai: 70,
      fullSafai: 1,
      refreshmentRate: 90,
      dcPerchi: 300,
      alliedMorde: 200
    }
  ]
};

const closingExpenseSlice = createSlice({
  name: 'closingExpenses',
  initialState,
  reducers: {
    setClosingExpense: (
      state,
      action: PayloadAction<Omit<ClosingExpense[], 'id'>>
    ) => {
     state.closingExpenses = action.payload;
    },
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

export const { addClosingExpense, removeClosingExpense, updateClosingExpense,setClosingExpense } =
  closingExpenseSlice.actions;
export default closingExpenseSlice.reducer;

export const allClosingExpenses = (state: RootState) =>
  state.closingExpenses.closingExpenses;
