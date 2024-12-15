import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the Bus type to reflect the new data structure
export type Buses = {
  id: number;
  busNumber: string;
  busType: string;
  busOwner: string;
  description: string;
  busStatus: string;
  brand: string;
};


interface BusState {
  buses: Buses[];
}

// Initialize state with example data for buses in the Pakistani context
const initialState: BusState = {
  buses: [
    // {
    //     id: 1,
    //     busNumber: 'PAK-786',
    //     busType: 'AC Coach',
    //     busOwner: 'Ali Khan',
    //     description: 'An air-conditioned coach for long-distance travel, equipped with comfortable seating and refreshments.',
    //     busStatus: 'Active',
    // },
    // {
    //     id: 2,
    //     busNumber: 'ISB-321',
    //     busType: 'Hiace Van',
    //     busOwner: 'Sara Ahmed',
    //     description: 'A well-maintained van ideal for intercity routes within Punjab, offering a comfortable journey.',
    //     busStatus: 'Under Maintenance',
    // },
  ],
};

// Create the slice for bus state management
const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setBus: (state, action: PayloadAction<Buses[]>) => {
      // Replace the entire state with the new array of buses
      state.buses = action.payload;
    },
    addBus: (state, action: PayloadAction<Omit<Buses, 'id'>>) => {
      const newBus = { ...action.payload, id: state.buses.length + 1 };
      state.buses.push(newBus);
    },
    removeBus: (state, action: PayloadAction<number>) => {
      state.buses = state.buses.filter(bus => bus.id !== action.payload);
    },
    updateBus: (state, action: PayloadAction<Buses>) => {
      const index = state.buses.findIndex(bus => bus.id === action.payload.id);
      if (index !== -1) {
        state.buses[index] = action.payload;
      }
    },
  },
});

export const { setBus, addBus, removeBus, updateBus } = busSlice.actions;
export default busSlice.reducer;

// Selector to retrieve all buses from the state
export const allBuses = (state: RootState) => state.buses.buses;
