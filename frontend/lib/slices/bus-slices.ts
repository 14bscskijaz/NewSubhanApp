import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

import { v4 as uuidv4 } from 'uuid';

// Define the Bus type to reflect the new data structure
export type Buses = {
    id: number;
    bus_number: string; 
    bus_type: string; 
    bus_owner: string; 
    description: string; 
    bus_status: string; 
}

interface BusState {
    buses: Buses[];
}

// Initialize state with example data for buses
// Initialize state with example data for buses in Pakistani context
const initialState: BusState = {
    buses: [
        {
            id: 1,
            bus_number: 'PAK-786',
            bus_type: 'AC Coach',
            bus_owner: 'Ali Khan',
            description: 'An air-conditioned coach for long-distance travel, equipped with comfortable seating and refreshments.',
            bus_status: 'Active',
        },
        {
            id: 2,
            bus_number: 'ISB-321',
            bus_type: 'Hiace Van',
            bus_owner: 'Sara Ahmed',
            description: 'A well-maintained van ideal for intercity routes within Punjab, offering a comfortable journey.',
            bus_status: 'Under Maintenance',
        },
    ],
};

// Create the slice for bus state management
const busSlice = createSlice({
    name: 'bus',
    initialState,
    reducers: {
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

export const { addBus, removeBus, updateBus } = busSlice.actions;
export default busSlice.reducer;

// Selector to retrieve all buses from the state
export const allBuses = (state: RootState) => state.buses.buses;
