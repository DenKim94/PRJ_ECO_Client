import { createContext } from 'react';
import { CalcultationRequest } from '../../types/CalculationTypes';

export interface CalculationEntry {
    meterid: string;
    startDate: number;
    endDate: number;
    daysBetween: number;
    paidAmountPeriod: number;
    bruttoTotalCostPeriod: number;
    totalConsumptionKwh: number;
    costDiffPeriod: number;
    usedEnergyPerDay: number;
    logMessage: string;    
}

/** TODO: Ausgaben ergänzen
 * * executeCalculation: (request: CalcultationRequest) => Promise<CalculationEntry[]>;
 * * getAllResults: () => Promise<CalculationEntry[]>;
 * * deleteAllResults: () => Promise<Map<string, string>>;
*/
export interface CalculationContextType {
    data: CalculationEntry[];
    serviceResponse: Map<string, string> | null;
    // executeCalculation: (request: CalcultationRequest) => Promise<CalculationEntry[]>;
    // getAllResults: () => Promise<CalculationEntry[]>;
    // deleteAllResults: () => Promise<Map<string, string>>;
}

export const CalculationContext = createContext<CalculationContextType | undefined>(undefined);