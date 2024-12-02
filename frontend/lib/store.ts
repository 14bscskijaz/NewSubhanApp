import { configureStore } from '@reduxjs/toolkit';
import employeSlices from './slices/employe-slices';
import routeSlices from './slices/route-slices';
import busSlices from './slices/bus-slices';
import TicketSlices from './slices/pricing-slices';
import fixedTripExpenseSlice from './slices/fixed-trip-expense';
import busClosingSlice from './slices/bus-closing';
import tripInformationSlice from './slices/trip-information';
import busClosingVoucherSlice from './slices/bus-closing-voucher';
import fixedClosingExpenseSlice from './slices/fixed-closing-expense-slice';
import expensesSlices from './slices/expenses-slices';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    employees: employeSlices,
    routes: routeSlices,
    buses: busSlices,
    tickets: TicketSlices,
    fixedTripExpenses: fixedTripExpenseSlice,
    busClosings: busClosingSlice,
    tripsInformation: tripInformationSlice,
    closingExpenses: fixedClosingExpenseSlice,
    busClosingVouchers: busClosingVoucherSlice,
    expenses:expensesSlices
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = {
  routes: ReturnType<typeof routeSlices>;
  employees: ReturnType<typeof employeSlices>;
  buses: ReturnType<typeof busSlices>;
  tickets: ReturnType<typeof TicketSlices>;
  fixedTripExpenses: ReturnType<typeof fixedTripExpenseSlice>;
  busClosings: ReturnType<typeof busClosingSlice>;
  tripsInformation: ReturnType<typeof tripInformationSlice>;
  busClosingVouchers: ReturnType<typeof busClosingVoucherSlice>;
  closingExpenses: ReturnType<typeof fixedClosingExpenseSlice>;
  expenses:ReturnType<typeof expensesSlices>
};

export type AppDispatch = typeof store.dispatch;

// Wrap your app with the Redux provider
