import { ReactNode, useCallback, useRef, useState } from "react";
import { Logger } from "../../utils/logger";
import { TrackingContext } from "./TrackingContext";
import { TrackingEntityRequest, TrackingEntityResponse } from "../../types/TrackingTypes";
import { useApiCall } from "../../hooks/useApiCall";
import { ErrorMessage } from "../../types/AuthTypes";
import { ApiMessageMap } from '../../types/AuthTypes';


const logger = new Logger('TrackingProvider');
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * @file TrackingProvider.tsx
 * 
 * Diese Datei definiert den TrackingProvider, der die getrackten Daten für die gesamte Anwendung bereitstellt.
 * 
 * Der Provider beinhaltet folgende Daten:
 * * newestEntry: TrackingEntityResponse | null;
 * * entryList: TrackingEntityResponse[];
 * * errorMsgRef: RefObject<ErrorMessage | undefined>;
 * * isLoading: boolean;
 * 
 * Der Provider implementiert folgende Funktionen:
 * * getAllEntries: () => Promise<TrackingEntityResponse[]>;
 * * addEntry: (request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * getNewestEntry: () => Promise<TrackingEntityResponse | null>;
 * * updateEntryById: (id: number, request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * deleteEntryById: (id: number) => Promise<Map<string, string>>;
 * * deleteAllEntries: () => Promise<Map<string, string>>;
 */
export const TrackingProvider = ({ children }: { children: ReactNode }) => {
    const trackingData = useApiCall<TrackingEntityResponse>();
    const trackingDataList = useApiCall<TrackingEntityResponse[]>();
    const deleteData = useApiCall<ApiMessageMap>();
    const errorMsgRef = useRef<ErrorMessage | undefined>(undefined);
    const [entryList, setEntryList] = useState<TrackingEntityResponse[]>([]);
    const [newestEntry, setNewestEntry] = useState<TrackingEntityResponse | null>(null);

    const isLoading : boolean = trackingData.isLoading || trackingDataList.isLoading || deleteData.isLoading;

    const getAllEntries = useCallback(async (): Promise<TrackingEntityResponse[]> => {
        logger.debug('Lade alle Tracking-Einträge vom Server ...');
        const response = await trackingDataList.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/tracking/get-all`});
        if (!response) { 
            errorMsgRef.current = trackingDataList.errorMsg.current; 
            return [];
        }
        logger.debug('Alle Tracking-Einträge erfolgreich geladen.');
        setEntryList(response);
        errorMsgRef.current = undefined;
        return response;

    },[trackingDataList]);

    const getNewestEntry = useCallback(async (): Promise<TrackingEntityResponse | null> => {
        logger.debug('Lade den neuesten Eintrag vom Server ...');
        const response = await trackingData.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/tracking/get-newest`});
        if (!response) { 
            errorMsgRef.current = trackingData.errorMsg.current; 
            return null;
        }
        logger.debug('Neuesten Eintrag erfolgreich geladen.');
        setNewestEntry(response);
        errorMsgRef.current = undefined;
        return response;

    },[trackingData]);

    const addEntry = useCallback(async (request: TrackingEntityRequest): Promise<TrackingEntityResponse | null> => {
        logger.debug('Füge neuen Eintrag hinzu ...', request);
        const response = await trackingData.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/tracking/add`, data: request });
        if (!response) {
            errorMsgRef.current = trackingData.errorMsg.current;
            return null;
        }
        logger.debug('Neuer Eintrag erfolgreich hinzugefügt.', response);
        setNewestEntry(response);
        setEntryList(prev => [...prev, response]);
        errorMsgRef.current = undefined;
        return response;

    },[trackingData]);

    const updateEntryById = useCallback(async (id: number, request: TrackingEntityRequest): Promise<TrackingEntityResponse | null> => {
        logger.debug(`Aktualisiere Eintrag mit ID ${id} ...`, request);
        const response = await trackingData.fetchData({ method: 'PUT', url: `${API_BASE_URL}/api/tracking/${id}/update`, data: request });
        if (!response) {
            errorMsgRef.current = trackingData.errorMsg.current;
            return null;
        }
        logger.debug(`Eintrag mit ID ${id} erfolgreich aktualisiert.`, response);
        setEntryList(prev => prev.map(entry => entry.id === id ? response : entry));
        if (newestEntry?.id === id) {
            setNewestEntry(response);
        }
        errorMsgRef.current = undefined;
        return response;

    },[trackingData, newestEntry]);

    const deleteEntryById = useCallback(async (id: number): Promise<ApiMessageMap | null> => {
        logger.debug(`Lösche Eintrag mit ID ${id} ...`);
        const response = await deleteData.fetchData({ method: 'DELETE', url: `${API_BASE_URL}/api/tracking/${id}/delete` });
        if (!response) {
            errorMsgRef.current = deleteData.errorMsg.current;
            return { message: deleteData.errorMsg.current?.message ?? `Fehler beim Löschen des Eintrags mit ID ${id}.` };
        }
        logger.debug(`Eintrag mit ID ${id} erfolgreich gelöscht.`, response);
        setEntryList(prev => prev.filter(entry => entry.id !== id));
        if (newestEntry?.id === id) {
            setNewestEntry(null);
        }
        errorMsgRef.current = undefined;
        return response;

    },[deleteData, newestEntry]);

    const deleteAllEntries = useCallback(async (): Promise<ApiMessageMap> => {
        logger.debug('Lösche alle Einträge ...');
        const response = await deleteData.fetchData({ method: 'DELETE', url: `${API_BASE_URL}/api/tracking/delete-all` });
        if (!response) {
            errorMsgRef.current = deleteData.errorMsg.current;
            return { message: deleteData.errorMsg.current?.message ?? 'Fehler beim Löschen aller Einträge.' };
        }
        logger.debug('Alle Einträge erfolgreich gelöscht.', response);
        setEntryList([]);
        setNewestEntry(null);
        errorMsgRef.current = undefined;
        return response;

    },[deleteData]);

    return (
        <TrackingContext.Provider value={{ 
            entryList, 
            newestEntry,
            errorMsgRef,
            isLoading,
            getAllEntries,
            getNewestEntry,
            addEntry,
            updateEntryById,
            deleteEntryById,
            deleteAllEntries
          }}>
            {children}
        </TrackingContext.Provider>
    );
};