export enum TransportMode {
  WALKING = 'WALKING',
  BIKING = 'BIKING',
  DRIVING = 'DRIVING',
  TRANSIT = 'TRANSIT',
  UNKNOWN = 'UNKNOWN',
}

export interface Coordinates {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface Trip {
  id: string;
  startTime: number;
  endTime: number;
  origin: Coordinates;
  destination: Coordinates;
  originAddress?: string;
  destinationAddress?: string;
  mode: TransportMode;
  path: Coordinates[];
  companions?: number;
  notes?: string;
}

export enum ExpenseCategory {
  TICKET = 'TICKET',
  FOOD = 'FOOD',
  SHOPPING = 'SHOPPING',
  ACCOMMODATION = 'ACCOMMODATION',
  OTHER = 'OTHER',
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  description: string;
  category: ExpenseCategory;
  timestamp: number;
  tripId?: string;
}

export interface Budget {
  amount: number;
  currency: string;
}

export interface Suggestion {
  title: string;
  description: string;
  estimatedBudget: string;
  budgetDetails: {
    item: string;
    cost: string;
  }[];
  transportMode: TransportMode | string;
  reason: string;
  imageUrl: string;
}

export interface Weather {
    condition: 'Sunny' | 'Cloudy' | 'Rainy';
    temperature: number; // in Celsius
}

export interface RouteSuggestion {
    mode: TransportMode | string;
    routeDescription: string;
    reason: string;
}