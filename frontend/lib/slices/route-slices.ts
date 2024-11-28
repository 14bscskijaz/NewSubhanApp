import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the Route type with the new schema
export type Route = {
  id: number;
  source: string;
  sourceStation: string;
  destination: string;
  destinationStation: string;
};

// Define the RouteState interface
interface RouteState {
  routes: Route[];
}

// Update the initialState to match the new schema
const initialState: RouteState = {
  routes: [
    {
      id: 1,
      source: 'Karachi',
      sourceStation: 'Karachi Station A',
      destination: 'Lahore',
      destinationStation: 'Lahore Station B'
    },
    {
      id: 2,
      source: 'Islamabad',
      sourceStation: 'Islamabad Station C',
      destination: 'Murree',
      destinationStation: 'Murree Station D'
    },
    {
      id: 3,
      source: 'Faisalabad',
      sourceStation: 'Railway Station',
      destination: 'Islamabad',
      destinationStation: 'G-9'
    },
    {
      id: 4,
      source: 'Islamabad',
      sourceStation: 'G-9',
      destination: 'Faisalabad',
      destinationStation: 'Railway Station'
    }
  ]
};

// Create the routeSlice
const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    // Action to add a route with auto-incremented ID
    addRoute: (state, action: PayloadAction<Omit<Route, 'id'>>) => {
      const newId =
        state.routes.length > 0
          ? state.routes[state.routes.length - 1].id + 1
          : 1;
      const newRoute: Route = { ...action.payload, id: newId };
      state.routes.push(newRoute);
    },

    // Action to remove a route by ID
    removeRoute: (state, action: PayloadAction<number>) => {
      state.routes = state.routes.filter(
        (route) => route.id !== action.payload
      );
    },

    // Action to update a route by ID
    updateRoute: (state, action: PayloadAction<Route>) => {
      const index = state.routes.findIndex(
        (route) => route.id === action.payload.id
      );
      if (index !== -1) {
        state.routes[index] = action.payload;
      }
    }
  }
});

// Export actions and reducer
export const { addRoute, removeRoute, updateRoute } = routeSlice.actions;
export default routeSlice.reducer;

// Selector to get all routes
export const allRoutes = (state: RootState) => state.routes.routes;
