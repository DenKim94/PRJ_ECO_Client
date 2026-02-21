import { createContext } from 'react';

export interface TrackingEntry {
    id: number;
    kwhValue: number;
    date: string;    
}

export interface TrackingContextType {
    data: TrackingEntry[];
    serviceResponse: Map<string, string> | null;
}

export const TrackingContext = createContext<TrackingContextType | undefined>(undefined);