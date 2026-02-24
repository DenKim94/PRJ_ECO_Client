import { ReactNode } from "react";
import { Logger } from "../../utils/logger";
import { CalculationContext } from "./CalculationContext";


const logger = new Logger('CalculationProvider');

/**
 * @file CalculationProvider.tsx
 * 
 * Diese Datei definiert den CalculationProvider, der die Calculation-Logik und -zustände für die gesamte Anwendung bereitstellt.
 * 
 * Der Provider implementiert folgende Funktionen:
 * * getAllResults: () => Promise<CalculationEntry[]>;
 * * executeCalculation: (request: CalcultationRequest) => Promise<CalculationEntry[]>;
 * * deleteAllResults: () => Promise<Map<string, string>>;
 */
export const CalculationProvider = ({ children }: { children: ReactNode }) => {

/** 
 * TODO: 
 * Implementieren der Funktionen und Zustände für Calculation, ähnlich wie im AuthProvider, unter Verwendung von useApiCall für API-Anfragen. 
 * Alle Funktionen sollten Fehlerbehandlung und Logging enthalten.
 * 
 * */ 

    return (
        <CalculationContext.Provider value={{ data: [], serviceResponse: null }}>
            {children}
        </CalculationContext.Provider>
    );
};