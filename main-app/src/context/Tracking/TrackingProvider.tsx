import { ReactNode } from "react";
import { Logger } from "../../utils/logger";
import { TrackingContext } from "./TrackingContext";


const logger = new Logger('TrackingProvider');

/**
 * @file TrackingProvider.tsx
 * 
 * Diese Datei definiert den TrackingProvider, der die Tracking-Logik und -zustände für die gesamte Anwendung bereitstellt.
 * 
 * Der Provider implementiert folgende Funktionen:
 * * getAllEntries: () => Promise<TrackingEntry[]>;
 * * addEntry: (request: AddEntryRequest) => Promise<TrackingEntry>;
 * * getNewestEntry: () => Promise<TrackingEntry | null>;
 * * updateEntryById: (request: UpdateEntryRequest) => Promise<TrackingEntry>;
 * * deleteEntryById: (id: number) => Promise<Map<string, string>>;
 * * deleteAllEntries: () => Promise<Map<string, string>>;
 */
export const TrackingProvider = ({ children }: { children: ReactNode }) => {

/** 
 * TODO: 
 * Implementieren der Funktionen und Zustände für Tracking, ähnlich wie im AuthProvider, unter Verwendung von useApiCall für API-Anfragen. 
 * Alle Funktionen sollten Fehlerbehandlung und Logging enthalten.
 * 
 * */ 

    return (
        <TrackingContext.Provider value={{ data: [], serviceResponse: null }}>
            {children}
        </TrackingContext.Provider>
    );
};