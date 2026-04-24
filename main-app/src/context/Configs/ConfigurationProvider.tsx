import { ReactNode, useCallback, useRef, useState } from "react";
import { Logger } from "../../utils/logger";
import { ConfigurationContext } from "./ConfigurationContext";
import { ConfigModel } from "../../types/ConfigTypes";
import { useApiCall } from "../../hooks/useApiCall";
import { ErrorMessage } from "../../types/AuthTypes";


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
 * * errorMsgRef: RefObject<ErrorMessage | undefined>;
 * * isLoading: boolean;
 * 
 * Der Provider implementiert folgende Funktionen:
 * * loadConfiguration: () => Promise<ConfigModel | null>;
 * * updateConfiguration: (request: ConfigModel) => Promise<boolean>;
 */
export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
    const configApi = useApiCall<ConfigModel>();
    const errorMsgRef = useRef<ErrorMessage | undefined>(undefined);
    const [configs, setConfigs] = useState<ConfigModel | null>(null);
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
            return false;
        }
        setConfigs(response);
        logger.debug('Konfiguration erfolgreich aktualisiert.');
        errorMsgRef.current = undefined;
        return true;

    }, [configApi]);

    return (
        <ConfigurationContext.Provider value={{ 
            errorMsgRef,
            configs, 
            isLoading,
            loadConfiguration, 
            updateConfiguration
        }}>
            {children}
        </ConfigurationContext.Provider>
    );
};