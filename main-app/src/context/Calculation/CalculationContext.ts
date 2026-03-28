import { createContext, RefObject } from 'react';
import { CalcultationRequest, CalculationDataResponse } from '../../types/CalculationTypes';
import { ApiMessageMap, ErrorMessage } from '../../types/AuthTypes';


export interface CalculationContextType {
    calcData: CalculationDataResponse[];
    isLoading: boolean;
    errorMsgRef: RefObject<ErrorMessage | undefined>;
    executeCalculation: (request: CalcultationRequest) => Promise<CalculationDataResponse[]>;
    loadResults: () => Promise<CalculationDataResponse[]>;
    deleteAllResults: () => Promise<ApiMessageMap>;
}

export const CalculationContext = createContext<CalculationContextType | undefined>(undefined);