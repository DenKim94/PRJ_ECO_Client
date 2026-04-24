import { createContext, RefObject } from 'react';
import { ConfigModel } from '../../types/ConfigTypes';
import { ErrorMessage } from '../../types/AuthTypes';

/** 
 * * configs: ConfigModel | null;
 * * loadConfiguration: () => Promise<ConfigModel | null>;
 * * updateConfiguration: (request: ConfigModel) => Promise<boolean>;
*/
export interface ConfigurationContextType {
    configs: ConfigModel | null;
    errorMsgRef: RefObject<ErrorMessage | undefined>;
    isLoading: boolean;
    loadConfiguration: () => Promise<ConfigModel | null>;
    updateConfiguration: (request: ConfigModel) => Promise<boolean>;
}

export const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);