import { ReactNode, useCallback, useRef, useState } from "react";
import { Logger } from "../../utils/logger";
import { TrackingContext } from "./TrackingContext";
import { EnergyDifferenceData, TrackingEntityRequest, TrackingEntityResponse } from "../../types/TrackingTypes";
import { useApiCall } from "../../hooks/useApiCall";
import { ResponseMessage } from "../../types/AuthTypes";
import { ApiMessageMap } from '../../types/AuthTypes';
import { MessageContainerProps } from "../../components/MessageContainer";
import { HelperClass, TimeRange } from "../../utils/helper";

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
 * * errorMsgRef: RefObject<ResponseMessage | undefined>;
 * * responseMsg: MessageContainerProps | null;
 * * isLoading: boolean;
 * 
 * Der Provider implementiert folgende Funktionen:
 * * resetResponseMsg: () => void;
 * * getAllEntries: () => Promise<TrackingEntityResponse[]>;
 * * addEntry: (request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * getNewestEntry: () => Promise<TrackingEntityResponse | null>;
 * * updateEntryById: (id: number, request: TrackingEntityRequest) => Promise<TrackingEntityResponse>;
 * * filterTrackingDataByTimeRange: (range: TimeRange, startDate?: string | null, maxDataPoints?: number) => TrackingEntityResponse[];
 * * deleteEntryById: (id: number) => Promise<Map<string, string>>;
 * * getUsedEnergyPerPeriod: () => EnergyDifferenceData[];
 * * deleteAllEntries: () => Promise<Map<string, string>>;
 */
export const TrackingProvider = ({ children }: { children: ReactNode }) => {
    const trackingData = useApiCall<TrackingEntityResponse>();
    const trackingDataList = useApiCall<TrackingEntityResponse[]>();
    const deleteData = useApiCall<ApiMessageMap>();
    const errorMsgRef = useRef<ResponseMessage | undefined>(undefined);
    const [entryList, setEntryList] = useState<TrackingEntityResponse[]>([]);
    const [newestEntry, setNewestEntry] = useState<TrackingEntityResponse | null>(null);
    const [responseMsg, setResponseMsg] = useState<MessageContainerProps | null>(null);

    const isLoading : boolean = trackingData.isLoading || trackingDataList.isLoading || deleteData.isLoading;

    const resetResponseMsg = useCallback(() => {
        setResponseMsg(null);
    }, []);

    const getAllEntries = useCallback(async (): Promise<TrackingEntityResponse[]> => {
        logger.debug('Lade alle Tracking-Einträge vom Server ...');
        const response = await trackingDataList.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/tracking/get-all`});
        if (!response) { 
            errorMsgRef.current = trackingDataList.errorMsg.current; 
            setResponseMsg({message: 'Fehler beim Laden der Daten.', type: 'error'});
            return [];
        }
        logger.debug('Alle Tracking-Einträge erfolgreich geladen.');
        setEntryList(response);
        errorMsgRef.current = undefined;
        return response;

    },[trackingDataList]);

    function getLatestEntry(entryList: TrackingEntityResponse[]) : TrackingEntityResponse | null {
        if (!entryList || entryList.length === 0) {
            return null;
        }
        return entryList.reduce((latest, current) => {
            const [d1, m1, y1] = latest.timestamp.split(".");
            const [d2, m2, y2] = current.timestamp.split(".");
            const latestDate = new Date(+y1, +m1 - 1, +d1);
            const currentDate = new Date(+y2, +m2 - 1, +d2);
            return currentDate > latestDate ? current : latest;
        });
    }

    const filterTrackingDataByTimeRange = useCallback((range: TimeRange, startDate?: string | null, maxDataPoints = 16): TrackingEntityResponse[] => {
        if (!entryList || entryList.length === 0) return [];
        logger.debug(`Filtere Tracking-Daten für ${range} und ${startDate} ...`);

        // Daten chronologisch aufsteigend sortieren
        const sortedData = [...entryList].sort((a, b) => 
            HelperClass.parseGermanDate(a.timestamp).getTime() - HelperClass.parseGermanDate(b.timestamp).getTime()
        );

        // Zieldatum ausgehend vom Startdatum berechnen
        let parsedStartDate: Date;
        
        if (startDate) {
            if (startDate.includes('T') || startDate.includes('-')) {
                parsedStartDate = new Date(startDate);
            } else {
                parsedStartDate = HelperClass.parseGermanDate(startDate);
            }
        } else {
            parsedStartDate = HelperClass.parseGermanDate(sortedData[0].timestamp);
        }

        // Startdatum auf 00:00:00 Uhr setzen
        parsedStartDate.setHours(0, 0, 0, 0);

        const targetEndDate = new Date(parsedStartDate);

        // Zeitraum auf das Enddatum addieren
        if (range === '6M') {
            targetEndDate.setMonth(targetEndDate.getMonth() + 6);
        } else if (range === '1Y') {
            targetEndDate.setFullYear(targetEndDate.getFullYear() + 1);
        } else if (range === '2Y') {
            targetEndDate.setFullYear(targetEndDate.getFullYear() + 2);
        }

        // Enddatum auf 23:59:59 Uhr setzen
        targetEndDate.setHours(23, 59, 59, 999);

        logger.debug(`Zeitraum zugeschnitten: ${parsedStartDate.toLocaleString('de-DE')} bis ${targetEndDate.toLocaleString('de-DE')}`);

        // Zeitraum filtern: Alles zwischen Start (00:00) und Ende (23:59)
        const filteredData = sortedData.filter(entry => {
            const entryDate = HelperClass.parseGermanDate(entry.timestamp);
            return entryDate.getTime() >= parsedStartDate.getTime() && 
                entryDate.getTime() <= targetEndDate.getTime();
        });
        
        // Downsampling
        if (filteredData.length <= maxDataPoints) {
            logger.debug(`Daten für Zeitraum ${range} gefiltert.`);
            return filteredData;
        }

        const downsampled: TrackingEntityResponse[] = [];
        const step = (filteredData.length - 1) / (maxDataPoints - 1);
        
        for (let i = 0; i < maxDataPoints; i++) {
            const index = Math.round(i * step);
            downsampled.push(filteredData[index]);
        }

        logger.debug(`Anzahl der Datenpunkte für Zeitraum ${range} angepasst: `, downsampled);
        return downsampled;

    }, [entryList]);


    const getNewestEntry = useCallback(async (): Promise<TrackingEntityResponse | null> => {
        let response: TrackingEntityResponse | null = null;

        if (entryList && entryList.length > 0) {
            logger.debug('Neuesten Eintrag laden ...');
            response = getLatestEntry(entryList);
        } 
        else {
            logger.debug('Lade den neuesten Eintrag vom Server ...');
            response = await trackingData.fetchData({ 
                method: 'GET', 
                url: `${API_BASE_URL}/api/tracking/get-newest`
            });
        }

        if (!response) { 
            errorMsgRef.current = trackingData.errorMsg.current;
            setResponseMsg({message: errorMsgRef.current?.message ?? 'Fehler beim Laden des neuesten Eintrags.', type: 'error'}); 
            return null;
        }
        logger.debug('Neuesten Eintrag erfolgreich geladen.');
        setNewestEntry(response);
        errorMsgRef.current = undefined;
        return response;

    },[trackingData, entryList]);

    const addEntry = useCallback(async (request: TrackingEntityRequest): Promise<TrackingEntityResponse | null> => {
        logger.debug('Füge neuen Eintrag hinzu ...', request);
        const response = await trackingData.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/tracking/add`, data: request });
        if (!response) {
            errorMsgRef.current = trackingData.errorMsg.current;
            setResponseMsg({message: `${errorMsgRef.current?.message ?? 'Fehler beim Hinzufügen des Eintrags.'}`, type: 'error'});
            return null;
        }
        logger.debug('Neuer Eintrag erfolgreich hinzugefügt.', response);
        setNewestEntry(response);
        setEntryList(prev => [...prev, response]);
        errorMsgRef.current = undefined;
        setResponseMsg({message: 'Eintrag erfolgreich hinzugefügt.', type: 'success'});
        return response;

    },[trackingData]);

    const updateEntryById = useCallback(async (id: number, request: TrackingEntityRequest): Promise<TrackingEntityResponse | null> => {
        logger.debug(`Aktualisiere Eintrag mit ID: ${id} ...`, request);
        const response = await trackingData.fetchData({ method: 'PUT', url: `${API_BASE_URL}/api/tracking/${id}/update`, data: request });
        if (!response) {
            errorMsgRef.current = trackingData.errorMsg.current;
            setResponseMsg({message: `${errorMsgRef.current?.message ?? 'Fehler beim Aktualisieren des Eintrags.'}`, type: 'error'});
            return null;
        }
        logger.debug(`Eintrag mit ID ${id} erfolgreich aktualisiert.`, response);
        setResponseMsg({message: 'Eintrag erfolgreich aktualisiert.', type: 'success'});
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
            setResponseMsg({message: `${errorMsgRef.current?.message ?? 'Fehler beim Löschen des Eintrags.'}`, type: 'error'});
            return { message: deleteData.errorMsg.current?.message ?? `Fehler beim Löschen des Eintrags mit ID ${id}.` };
        }
        logger.debug(`Eintrag mit ID ${id} erfolgreich gelöscht.`, response);
        setEntryList(prev => prev.filter(entry => entry.id !== id));
        if (newestEntry?.id === id) {
            setNewestEntry(null);
        }
        setResponseMsg({message: 'Eintrag erfolgreich gelöscht.', type: 'success'});
        errorMsgRef.current = undefined;
        return response;

    },[deleteData, newestEntry]);

    const deleteAllEntries = useCallback(async (): Promise<ApiMessageMap> => {
        logger.debug('Lösche alle Einträge ...');
        const response = await deleteData.fetchData({ method: 'DELETE', url: `${API_BASE_URL}/api/tracking/delete-all` });
        if (!response) {
            errorMsgRef.current = deleteData.errorMsg.current;
            setResponseMsg({message: `${errorMsgRef.current?.message ?? 'Fehler beim Löschen der Einträge.'}`, type: 'error'});
            return { message: deleteData.errorMsg.current?.message ?? 'Fehler beim Löschen aller Einträge.' };
        }
        logger.debug('Alle Einträge erfolgreich gelöscht.', response);
        setEntryList([]);
        setNewestEntry(null);
        setResponseMsg({message: 'Alle Einträge erfolgreich gelöscht.', type: 'success'});
        errorMsgRef.current = undefined;
        return response;

    },[deleteData]);

    const getUsedEnergyPerPeriod = useCallback((data: TrackingEntityResponse[]): EnergyDifferenceData[] => {
        
        if (!data || data.length === 0) {
            return [];
        }

        // Sortierte Einträge (nach Datum aufsteigend)
        const sortedEntries = [...data].sort((a, b) => {
            return HelperClass.parseDateToMs(a.timestamp) - HelperClass.parseDateToMs(b.timestamp);
        });

        // Geht jeden Eintrag im Array durch und erzeugt ein neues, erweitertes Array
        const usedEnergyDifference = sortedEntries.map((currentEntry, index, array) => {
            let diff = 0;
            let days = 0;

            if (index > 0) { // Wir können index === 0 überspringen, da es eh abgeschnitten wird
                const prevEntry = array[index - 1];
                // Tage-Differenz berechnen
                const currentMs = HelperClass.parseDateToMs(currentEntry.timestamp);
                const prevMs = HelperClass.parseDateToMs(prevEntry.timestamp);
                                
                // Differenz in Millisekunden durch die Millisekunden eines Tages teilen
                days = Math.round((currentMs - prevMs) / (1000 * 60 * 60 * 24));

                // Energie-Differenz berechnen
                diff = (currentEntry.readingValue - prevEntry.readingValue)/days;
            }

            return {
                date: currentEntry.timestamp, 
                periodDays: days,                     
                energyDifferenceNorm: Number(diff.toFixed(3))
            };
        });

        return usedEnergyDifference.slice(1);

    }, []);

    return (
        <TrackingContext.Provider value={{ 
            entryList, 
            newestEntry,
            errorMsgRef,
            responseMsg,
            isLoading,
            resetResponseMsg,
            filterTrackingDataByTimeRange,
            getAllEntries,
            getNewestEntry,
            addEntry,
            getUsedEnergyPerPeriod,
            updateEntryById,
            deleteEntryById,
            deleteAllEntries
          }}>
            {children}
        </TrackingContext.Provider>
    );
};