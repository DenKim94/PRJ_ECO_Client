import { ReactNode, useCallback, useRef, useState } from "react";
import { Logger } from "../../utils/logger";
import { ConfigurationContext } from "./ConfigurationContext";
import { ConfigModel } from "../../types/ConfigTypes";
import { useApiCall } from "../../hooks/useApiCall";


const logger = new Logger('ConfigurationProvider');
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * @file ConfigurationProvider.tsx
 * 
 * Diese Datei definiert den ConfigurationProvider, der die Konfigurationsparameter für die gesamte Anwendung bereitstellt.
 * 
 * Der Provider implementiert folgende Funktionen:
    * * getConfiguration: () => Promise<ConfigModel | null>;
    * * updateConfiguration: (request: ConfigModel) => Promise<ConfigModel | null>;
 */
export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
    const configApi = useApiCall<ConfigModel>();
    const errorMsgRef = useRef<{ code?: number; message: string } | undefined>(undefined);
    const [configs, setConfigs] = useState<ConfigModel | null>(null);

    const getConfiguration = useCallback(async (): Promise<ConfigModel | null> => {
        logger.debug('Lade Konfiguration vom Server...');
        const response = await configApi.fetchData({ method: 'GET', url: `${API_BASE_URL}/api/config`});
        if (!response) { 
            errorMsgRef.current = configApi.errorMsg.current; 
            return null;
        }
        setConfigs(response);
        logger.debug('Konfiguration erfolgreich geladen.');
        return response;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateConfiguration = useCallback(async (request: ConfigModel): Promise<ConfigModel | null> => {
        logger.debug('Aktualisiere Konfiguration...');
        const response = await configApi.fetchData({ method: 'PUT', url: `${API_BASE_URL}/api/config`, data: request });
        if (!response) {
            errorMsgRef.current = configApi.errorMsg.current;
            return null;
        }
        setConfigs(response);
        logger.debug('Konfiguration erfolgreich aktualisiert.');
        return response;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ConfigurationContext.Provider value={{ configs, 
            getConfiguration, 
            updateConfiguration
        }}>
            {children}
        </ConfigurationContext.Provider>
    );
};