export interface RouteMetric {
    routeKey: string;
    sourceCity?: string;
    destinationCity?: string;
    sourceAdda?: string;
    destinationAdda?: string;
    totalTrips: number;
    totalPassengers: number;
    totalRevenue: number;
    freePassengers: number;
    halfPassengers: number;
    fullPassengers: number;
    averagePassengers: number;
    routeCount: number;
    routeIds: string[];
    tripsCount: number;
    voucherIds: string[];
  }
  
  export interface SearchFilters {
    search: string;
    busNumber: string;
    dateRange: string;
    route: string | string[];
    limit: number;
    page: number;
  }
  
  export interface DateRange {
    start: Date | null;
    end: Date | null;
  }
  
  export interface RouteDetails {
    sourceAdda: string;
    sourceCity: string;
    destinationAdda: string;
    destinationCity: string;
    id: number | string;
  }
  
  export interface VoucherPrintData extends RouteMetric {
    route: string;
  }
  
  