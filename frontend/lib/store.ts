import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';

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
import tripInformationSaved from './slices/trip-information-saved';
import savedExpenses from './slices/saved-expenses';
import busReportSlice from './slices/Report/bus-report-slice';

// const persistConfig = {
//   key: 'root',
//   storage,
//   // Optionally, you can blacklist or whitelist specific reducers
//   // blacklist: ['someReducer']
//   // whitelist: ['someReducer']
// };

const rootReducer = combineReducers({
  employees: employeSlices,
  routes: routeSlices,
  buses: busSlices,
  tickets: TicketSlices,
  fixedTripExpenses: fixedTripExpenseSlice,
  busClosings: busClosingSlice,
  tripsInformation: tripInformationSlice,
  closingExpenses: fixedClosingExpenseSlice,
  busClosingVouchers: busClosingVoucherSlice,
  expenses: expensesSlices,
  savedTripsInformation: tripInformationSaved,
  savedExpense: savedExpenses,
  busReport: busReportSlice
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  // reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

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
  expenses: ReturnType<typeof expensesSlices>
  savedTripsInformation: ReturnType<typeof tripInformationSaved>
  savedExpense: ReturnType<typeof savedExpenses>
  busReport: ReturnType<typeof busReportSlice>

};
export type AppDispatch = typeof store.dispatch;

