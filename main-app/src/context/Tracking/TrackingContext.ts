import { createContext } from 'react';

export interface TrackingEntry {
    id: number;
    kwhValue: number;
    date: string;    
}

/** TODO: Ausgaben ergänzen
 * * getAllEntries: () => Promise<TrackingEntry[]>;
 * * addEntry: (request: AddEntryRequest) => Promise<TrackingEntry>;
 * * getNewestEntry: () => Promise<TrackingEntry | null>;
 * * updateEntryById: (request: UpdateEntryRequest) => Promise<TrackingEntry>;
 * * deleteEntryById: (id: number) => Promise<Map<string, string>>;
 * * deleteAllEntries: () => Promise<Map<string, string>>;
*/
export interface TrackingContextType {
    data: TrackingEntry[];
    serviceResponse: Map<string, string> | null;
}

export const TrackingContext = createContext<TrackingContextType | undefined>(undefined);