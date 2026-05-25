import { createContext, RefObject } from 'react';
import { EnergyDifferenceData, TrackingEntityRequest, TrackingEntityResponse } from "../../types/TrackingTypes";
import { ResponseMessage } from '../../types/AuthTypes';
import { ApiMessageMap } from '../../types/AuthTypes';
import { MessageContainerProps } from '../../components/MessageContainer';
import { TimeRange } from '../../utils/helper';

/**
 * * newestEntry: TrackingEntityResponse | null;
 * * entryList: TrackingEntityResponse[];
 * * errorMsgRef: RefObject<ResponseMessage | undefined>;
 * * responseMsg: MessageContainerProps | null;
 * * isLoading: boolean;
 * * resetResponseMsg: () => void;
 * * filterTrackingDataByTimeRange: (range: TimeRange, maxDataPoints?: number) => TrackingEntityResponse[];
 * * getAllEntries: () => Promise<TrackingEntityResponse[]>;
 * * addEntry: (request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * getNewestEntry: () => Promise<TrackingEntityResponse | null>;
 * * updateEntryById: (id: number, request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * deleteEntryById: (id: number) => Promise<ApiMessageMap>;
 * * getUsedEnergyPerPeriod: (data: TrackingEntityResponse[]) => EnergyDifferenceData[];
 * * deleteAllEntries: () => Promise<ApiMessageMap>;
*/
export interface TrackingContextType {
    newestEntry: TrackingEntityResponse | null;
    entryList: TrackingEntityResponse[];
    errorMsgRef: RefObject<ResponseMessage | undefined>;
    responseMsg: MessageContainerProps | null;
    isLoading: boolean;
    resetResponseMsg: () => void;
    filterTrackingDataByTimeRange: (range: TimeRange, maxDataPoints?: number) => TrackingEntityResponse[];
    getAllEntries: () => Promise<TrackingEntityResponse[]>;
    getNewestEntry: () => Promise<TrackingEntityResponse | null>;
    addEntry: (request: TrackingEntityRequest) => Promise<TrackingEntityResponse | null>;
    updateEntryById: (id: number, request: TrackingEntityRequest) => Promise<TrackingEntityResponse | null>;
    deleteEntryById: (id: number) => Promise<ApiMessageMap | null>;
    getUsedEnergyPerPeriod: (data: TrackingEntityResponse[]) => EnergyDifferenceData[];
    deleteAllEntries: () => Promise<ApiMessageMap>;
}

export const TrackingContext = createContext<TrackingContextType | undefined>(undefined);