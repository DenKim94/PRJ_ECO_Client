import { ReactNode, useCallback, useRef, useState } from "react";
import { Logger } from "../../utils/logger";
import { CalculationContext } from "./CalculationContext";
import { useApiCall } from "../../hooks/useApiCall";
import { HelperClass } from "../../utils/helper";
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
 * * executeCalculation: (request: CalcultationRequest) => Promise<CalculationDataResponse[]>;
 * * deleteAllResults: () => Promise<ApiMessageMap>;
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
    }, [calcApi, setCalcData]);

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

    return (
        <CalculationContext.Provider value={{ 
            calcData, 
            isLoading, 
            errorMsgRef,
            responseMsg,
            resetResponseMsg,
            executeCalculation,
            loadResults,
            deleteAllResults
         }}>
            {children}
        </CalculationContext.Provider>
    );
};
