import { createContext, RefObject } from 'react';
import { ConfigModel } from '../../types/ConfigTypes';
import { ResponseMessage } from '../../types/AuthTypes';

export type SaveResult = 'success' | 'error' | 'idle';

/** 
 * * configs: ConfigModel | null;
 * * errorMsgRef: RefObject<ResponseMessage | undefined>;
 * * isLoading: boolean;
 * * saveResult: SaveResult;
 * * loadConfiguration: () => Promise<ConfigModel | null>;
 * * updateConfiguration: (request: ConfigModel) => Promise<boolean>;
*/
export interface ConfigurationContextType {
    configs: ConfigModel | null;
    errorMsgRef: RefObject<ResponseMessage | undefined>;
    isLoading: boolean;
    saveResult: SaveResult;
    loadConfiguration: () => Promise<ConfigModel | null>;
    resetSaveResult: () => void;
    updateConfiguration: (request: ConfigModel) => Promise<boolean>;
}

export const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);