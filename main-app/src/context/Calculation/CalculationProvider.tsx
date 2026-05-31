import { ReactNode, useCallback, useRef, useState } from "react";
import { Logger } from "../../utils/logger";
import { CalculationContext } from "./CalculationContext";
import { useApiCall } from "../../hooks/useApiCall";
import { HelperClass, TimeRange } from "../../utils/helper";
import { CalculationDataResponse, CalcultationRequest } from "../../types/CalculationTypes";
import { ApiMessageMap, ResponseMessage } from "../../types/AuthTypes";
import { MessageContainerProps } from "../../components/MessageContainer";


const logger = new Logger('CalculationProvider');
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * @file CalculationProvider.tsx
 * 
 * Diese Datei definiert den CalculationProvider, der die Berechnungs-Logik und -zustände für die gesamte Anwendung bereitstellt.
 * 
 * Der Provider beinhaltet folgende Daten:
 * * calcData: CalculationEntry[];
 * * isLoading: boolean;
 * * errorMsgRef: RefObject<ResponseMessage | undefined>;
 * 
 * Der Provider implementiert folgende Funktionen:
 * * loadResults: () => Promise<CalculationDataResponse[]>;
 * * resetResponseMsg: () => void;
 * * executeCalculation: (request: CalcultationRequest) => Promise<CalculationDataResponse[]>;
 * * deleteAllResults: () => Promise<ApiMessageMap>;
 * * filterCalcDataByTimeRange: (range: TimeRange, startDate?: string | null, maxDataPoints?: number) => CalculationDataResponse[];
 */
export const CalculationProvider = ({ children }: { children: ReactNode }) => {
    const calcApi = useApiCall<CalculationDataResponse[]>();
    const deleteApi = useApiCall<ApiMessageMap>();
    const errorMsgRef = useRef<ResponseMessage | undefined>(undefined);
    const [responseMsg, setResponseMsg] = useState<MessageContainerProps | null>(null);
    const [calcData, setCalcData] = useState<CalculationDataResponse[]>([]);
    const isLoading : boolean = calcApi.isLoading || deleteApi.isLoading;

    const resetResponseMsg = useCallback(() => {
        setResponseMsg(null);
    }, []);

    const loadResults = useCallback(async (): Promise<CalculationDataResponse[]> => {
        if (calcData.length > 0) {
            logger.debug('Berechnungsergebnisse bereits vorhanden, lade nicht erneut vom Server.');
            return calcData;
        }
        logger.debug('Lade Berechnungsergebnisse vom Server ...');
        const response = await calcApi.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/calculation/get-results`});
        if (!response) { 
            errorMsgRef.current = calcApi.errorMsg.current; 
            setResponseMsg({message: errorMsgRef.current?.message ?? 'Berechnungsergebnisse konnten nicht geladen werden.', type: 'error'});
            return [];
        }
        const formattedResponse = response.map((item: CalculationDataResponse) => {
            return {
                ...item,
                periodStart: HelperClass.formatDateForServer(item.periodStart), 
                periodEnd: HelperClass.formatDateForServer(item.periodEnd) 
            };
        });

        setCalcData(formattedResponse);
        logger.debug('Berechnungsergebnisse erfolgreich geladen.');
        errorMsgRef.current = undefined;
        return response;

    }, [calcApi, setCalcData, calcData]);

    const executeCalculation = useCallback(async (request: CalcultationRequest): Promise<CalculationDataResponse[]> => {
        logger.debug('Führe Berechnung auf dem Server aus ...', request);
        const response = await calcApi.fetchData({ method: 'POST', url: `${API_BASE_URL}/api/calculation/run-and-save`, data: request });
        if (!response) { 
            errorMsgRef.current = calcApi.errorMsg.current; 
            setResponseMsg({message: errorMsgRef.current?.message ?? 'Fehler bei der Berechnung ist aufgetreten.', type: 'error'});
            return [];
        }
        const formattedResponse = response.map((item: CalculationDataResponse) => {
            return {
                ...item,
                periodStart: HelperClass.formatDateForServer(item.periodStart), 
                periodEnd: HelperClass.formatDateForServer(item.periodEnd) 
            };
        });

        setCalcData(formattedResponse);
        logger.debug('Berechnung erfolgreich ausgeführt. Ergebnisse wurden gespeichert.');
        setResponseMsg({message: 'Berechnung erfolgreich ausgeführt. Ergebnisse wurden gespeichert.', type: 'success'});
        errorMsgRef.current = undefined;
        return response;
    }, [calcApi, setCalcData]);

    const deleteAllResults = useCallback(async (): Promise<ApiMessageMap> => {
        logger.debug('Lösche alle Berechnungsergebnisse auf dem Server ...');
        const response = await deleteApi.fetchData({ method: 'DELETE', url: `${API_BASE_URL}/api/calculation/delete-all` });
        if (!response) { 
            errorMsgRef.current = deleteApi.errorMsg.current; 
            setResponseMsg({message: errorMsgRef.current?.message ?? 'Daten konnten nicht gelöscht werden.', type: 'error'});
            return { message: deleteApi.errorMsg.current?.message ?? `Fehler beim Löschen der Ergebnisse.` };
        }
        setCalcData([]);
        logger.debug('Alle Berechnungsergebnisse erfolgreich gelöscht.');
        setResponseMsg({message: response.message, type: 'success'});
        errorMsgRef.current = undefined;
        return response;
    }, [deleteApi, setCalcData]);

    const filterCalcDataByTimeRange = useCallback((range: TimeRange, startDate?: string | null, maxDataPoints = 16): CalculationDataResponse[] => {
        if (!calcData || calcData.length === 0) return [];
        logger.debug(`Filtere Berechnungsdaten für ${range} und ${startDate} ...`);

        // Daten chronologisch aufsteigend sortieren
        const sortedData = [...calcData].sort((a, b) => 
            HelperClass.parseGermanDate(a.periodEnd).getTime() - HelperClass.parseGermanDate(b.periodEnd).getTime()
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
            parsedStartDate = HelperClass.parseGermanDate(sortedData[0].periodEnd);
        }

        // Startdatum auf 00:00:00 Uhr setzen
        parsedStartDate.setHours(0, 0, 0, 0);

        // Zieldatum berechnen
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
            const entryDate = HelperClass.parseGermanDate(entry.periodEnd);
            return entryDate.getTime() >= parsedStartDate.getTime() && 
                entryDate.getTime() <= targetEndDate.getTime();
        });

        // Downsampling (Auflösung verringern), falls > maxDataPoints
        if (filteredData.length <= maxDataPoints) {
            logger.debug(`Daten für Zeitraum ${range} gefiltert.`);
            return filteredData;
        }

        const downsampled: CalculationDataResponse[] = [];
        // Berechnet die Schrittweite, um exakt maxDataPoints aus dem Array zu entnehmen
        const step = (filteredData.length - 1) / (maxDataPoints - 1);
        
        for (let i = 0; i < maxDataPoints; i++) {
            // Durch Math.round wird auf den nächsten passenden Array-Index gerundet
            const index = Math.round(i * step);
            downsampled.push(filteredData[index]);
        }

        logger.debug(`Anzahl der Datenpunkte für Zeitraum ${range} angepasst: `, downsampled);
        return downsampled;
        
    }, [calcData]);

    return (
        <CalculationContext.Provider value={{ 
            calcData, 
            isLoading, 
            errorMsgRef,
            responseMsg,
            resetResponseMsg,
            filterCalcDataByTimeRange,
            executeCalculation,
            loadResults,
            deleteAllResults
         }}>
            {children}
        </CalculationContext.Provider>
    );
};
