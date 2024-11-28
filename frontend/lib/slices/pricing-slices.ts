import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { string } from 'zod';

// Define the Route type with busType
export type TicketPrice = {
  id: number;
  source: string;
  destination: string;
  ticketPrice: number;
  busType: string;
};
export type TicketPriceInput = {
  id: number;
  ticketPrice: number;
  busType: string;
};

export type TicketPriceRaw = {
  id: number;
  routeId: number;
  busType: string;
  ticketPrice: number;
};

// Define the ticketstate interface
interface TicketState {
  ticketsRaw: TicketPriceRaw[];
}

const initialState: TicketState = {
  ticketsRaw: [
    {
      id: 1,
      routeId: 1,
      busType: 'Luxury',
      ticketPrice: 2700
    },
    {
      id: 2,
      routeId: 1,
      busType: 'Standard',
      ticketPrice: 2100
    },
    {
      id: 3,
      routeId: 2,
      busType: 'Luxury',
      ticketPrice: 2700
    },
    {
      id: 4,
      routeId: 2,
      busType: 'Standard',
      ticketPrice: 2100
    },
    {
      id: 5,
      routeId: 3,
      busType: 'Luxury',
      ticketPrice: 2100
    },
    {
      id: 6,
      routeId: 3,
      busType: 'Standard',
      ticketPrice: 1600
    },
    {
      id: 7,
      routeId: 4,
      busType: 'Luxury',
      ticketPrice: 2100
    },
    {
      id: 8,
      routeId: 4,
      busType: 'Standard',
      ticketPrice: 1600
    }
  ]
};

// Create the ticketslice
const TicketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // Action to add a ticket price with auto-incremented ID
    addTicketRaw: (
      state,
      action: PayloadAction<Omit<TicketPriceRaw, 'id'>>
    ) => {
      const newId =
        state.ticketsRaw.length > 0
          ? state.ticketsRaw[state.ticketsRaw.length - 1].id + 1
          : 1;
      const newRoute: TicketPriceRaw = { ...action.payload, id: newId };
      state.ticketsRaw.push(newRoute);
    },

    // Action to remove a ticket price by ID
    removeTicketRaw: (state, action: PayloadAction<number>) => {
      state.ticketsRaw = state.ticketsRaw.filter(
        (route) => route.id !== action.payload
      );
    },

    // Action to update a ticket price by ID
    updateTicketRaw: (state, action: PayloadAction<TicketPriceRaw>) => {
      const index = state.ticketsRaw.findIndex(
        (route) => route.id === action.payload.id
      );
      if (index !== -1) {
        state.ticketsRaw[index] = action.payload;
      }
    }
  }
});

// Export actions and reducer
export const { addTicketRaw, removeTicketRaw, updateTicketRaw } =
  TicketSlice.actions;
export default TicketSlice.reducer;

// Selector to get all tickets
export const allTicketsRaw = (state: RootState) => state.tickets.ticketsRaw;
