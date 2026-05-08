import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { Logger } from "../../utils/logger";
import { ConfigurationContext, SaveResult } from "./ConfigurationContext";
import { ConfigModel } from "../../types/ConfigTypes";
import { useApiCall } from "../../hooks/useApiCall";
import { ResponseMessage } from "../../types/AuthTypes";


const logger = new Logger('ConfigurationProvider');
const API_BASE_URL = import.meta.env.VITE_API_URL;


/**
 * @file ConfigurationProvider.tsx
 * 
 * Diese Datei definiert den ConfigurationProvider, der die spezifischen Konfigurationsparameter für die gesamte Anwendung bereitstellt.
 * Anhand dieser Konfiguration werden die Kosten-Berechnungen in der Anwendung durchgeführt.
 * 
 * Der Provider beinhaltet folgende Daten:
 * * configs: ConfigModel | null;
 * * saveResult: 'success' | 'error' | 'idle';
 * * errorMsgRef: RefObject<ResponseMessage | undefined>;
 * * isLoading: boolean;
 * 
 * Der Provider implementiert folgende Funktionen:
 * * loadConfiguration: () => Promise<ConfigModel | null>;
 * * resetSaveResult: () => void;
 * * updateConfiguration: (request: ConfigModel) => Promise<boolean>;
 * * formatDateForServer: (dateStr: string) => string;
 * * formatDateForClient: (dateStr: string) => string;
 *  
 * */
export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
    const configApi = useApiCall<ConfigModel>();
    const errorMsgRef = useRef<ResponseMessage | undefined>(undefined);
    const [configs, setConfigs] = useState<ConfigModel | null>(null);
    const [saveResult, setSaveResult] = useState<SaveResult>('idle');
    const isLoading : boolean = configApi.isLoading;

    const loadConfiguration = useCallback(async (): Promise<ConfigModel | null> => {
        logger.debug('Lade Konfiguration vom Server...');
        const response = await configApi.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/config`});
        if (!response) { 
            errorMsgRef.current = configApi.errorMsg.current;
            return null;
        }
        setConfigs(response);
        logger.debug('Konfiguration erfolgreich geladen.', response);
        errorMsgRef.current = undefined;
        return response;

    }, [configApi]);

    const updateConfiguration = useCallback(async (request: ConfigModel): Promise<boolean> => {
        logger.debug('Aktualisiere Konfiguration...');
        const response = await configApi.fetchData({ method: 'PUT', url: `${API_BASE_URL}/api/config`, data: request });
        if (!response) {
            errorMsgRef.current = configApi.errorMsg.current;
            setSaveResult('error');
            return false;
        }
        setConfigs(response);
        logger.debug('Konfiguration erfolgreich aktualisiert.');
        errorMsgRef.current = undefined;
        setSaveResult('success');
        return true;

    }, [configApi]);
    
    const resetSaveResult = useCallback(() => setSaveResult('idle'), []);

    const contextValue = useMemo(() => ({
        errorMsgRef,
        configs,
        isLoading,
        saveResult,        
        resetSaveResult,   
        loadConfiguration,
        updateConfiguration,
    }), [configs, isLoading, saveResult, resetSaveResult, loadConfiguration, updateConfiguration]);

    return (
        <ConfigurationContext.Provider value={contextValue}>
            {children}
        </ConfigurationContext.Provider>
    );
};