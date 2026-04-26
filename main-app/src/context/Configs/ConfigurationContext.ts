import { createContext, RefObject } from 'react';
import { ConfigModel } from '../../types/ConfigTypes';
import { ErrorMessage } from '../../types/AuthTypes';

export type SaveResult = 'success' | 'error' | 'idle';

/** 
 * * configs: ConfigModel | null;
 * * loadConfiguration: () => Promise<ConfigModel | null>;
 * * updateConfiguration: (request: ConfigModel) => Promise<boolean>;
 * * formatDateForServer: (dateStr: string) => string;
 * * formatDateForClient: (dateStr: string) => string;
 *
*/
export interface ConfigurationContextType {
    configs: ConfigModel | null;
    errorMsgRef: RefObject<ErrorMessage | undefined>;
    isLoading: boolean;
    saveResult: SaveResult;
    loadConfiguration: () => Promise<ConfigModel | null>;
    resetSaveResult: () => void;
    updateConfiguration: (request: ConfigModel) => Promise<boolean>;
    formatDateForServer: (dateStr: string) => string;
    formatDateForClient: (dateStr: string) => string;
}

export const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);