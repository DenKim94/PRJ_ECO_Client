import { createContext, RefObject } from 'react';
import { TrackingEntityRequest, TrackingEntityResponse } from "../../types/TrackingTypes";
import { ErrorMessage } from '../../types/AuthTypes';
import { ApiMessageMap } from '../../types/AuthTypes';

/**
 * * newestEntry: TrackingEntityResponse | null;
 * * entryList: TrackingEntityResponse[];
 * * getAllEntries: () => Promise<TrackingEntityResponse[]>;
 * * addEntry: (request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * getNewestEntry: () => Promise<TrackingEntityResponse | null>;
 * * updateEntryById: (id: number, request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * deleteEntryById: (id: number) => Promise<ApiMessageMap>;
 * * deleteAllEntries: () => Promise<ApiMessageMap>;
*/
export interface TrackingContextType {
    newestEntry: TrackingEntityResponse | null;
    entryList: TrackingEntityResponse[];
    errorMsgRef: RefObject<ErrorMessage | undefined>;
    isLoading: boolean;
    getAllEntries: () => Promise<TrackingEntityResponse[]>;
    getNewestEntry: () => Promise<TrackingEntityResponse | null>;
    addEntry: (request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
    updateEntryById: (id: number, request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
    deleteEntryById: (id: number) => Promise<ApiMessageMap>;
    deleteAllEntries: () => Promise<ApiMessageMap>;
}

export const TrackingContext = createContext<TrackingContextType | undefined>(undefined);