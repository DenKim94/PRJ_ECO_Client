import { createContext, RefObject } from 'react';
import { CalcultationRequest, CalculationDataResponse } from '../../types/CalculationTypes';
import { ApiMessageMap, ResponseMessage } from '../../types/AuthTypes';
import { MessageContainerProps } from '../../components/MessageContainer';
import { TimeRange } from '../../utils/helper';


export interface CalculationContextType {
    calcData: CalculationDataResponse[];
    isLoading: boolean;
    errorMsgRef: RefObject<ResponseMessage | undefined>;
    responseMsg: MessageContainerProps | null;
    resetResponseMsg: () => void;
    executeCalculation: (request: CalcultationRequest) => Promise<CalculationDataResponse[]>;
    filterCalcDataByTimeRange: (range: TimeRange, startDate?: string | null, maxDataPoints?: number) => CalculationDataResponse[];
    loadResults: () => Promise<CalculationDataResponse[]>;
    deleteAllResults: () => Promise<ApiMessageMap>;
}

export const CalculationContext = createContext<CalculationContextType | undefined>(undefined);