import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the Route type with the new schema
export type Route = {
  id: number;
  sourceCity: string;
  sourceAdda: string;
  destinationCity: string;
  destinationAdda: string;
};

// Define the RouteState interface
interface RouteState {
  routes: Route[];
}

// Update the initialState to match the new schema
const initialState: RouteState = {
  routes: [
    // {
    //   id: 1,
    //   sourceCity: 'Karachi',
    //   sourceAdda: 'Karachi Station A',
    //   destinationCity: 'Lahore',
    //   destinationAdda: 'Lahore Station B'
    // },
    // {
    //   id: 2,
    //   sourceCity: 'Islamabad',
    //   sourceAdda: 'Islamabad Station C',
    //   destinationCity: 'Murree',
    //   destinationAdda: 'Murree Station D'
    // },
    // {
    //   id: 3,
    //   sourceCity: 'Faisalabad',
    //   sourceAdda: 'Railway Station',
    //   destinationCity: 'Islamabad',
    //   destinationAdda: 'G-9'
    // },
    // {
    //   id: 4,
    //   sourceCity: 'Islamabad',
    //   sourceAdda: 'G-9',
    //   destinationCity: 'Faisalabad',
    //   destinationAdda: 'Railway Station'
    // }
  ]
};

// Create the routeSlice
const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
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
    },
    setRoute: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload;
    }
  }
});

// Export actions and reducer
export const { addRoute, removeRoute, updateRoute,setRoute } = routeSlice.actions;
export default routeSlice.reducer;

// Selector to get all routes
export const allRoutes = (state: RootState) => state.routes.routes;
