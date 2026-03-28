import { createContext, RefObject } from 'react';
import { ConfigModel } from '../../types/ConfigTypes';
import { ErrorMessage } from '../../types/AuthTypes';

/** 
 * * configs: ConfigModel | null;
 * * getConfiguration: () => Promise<ConfigModel | null>;
 * * updateConfiguration: (request: ConfigModel) => Promise<ConfigModel | null>;
*/
export interface ConfigurationContextType {
    configs: ConfigModel | null;
    errorMsgRef: RefObject<ErrorMessage | undefined>;
    isLoading: boolean;
    getConfiguration: () => Promise<ConfigModel | null>;
    updateConfiguration: (request: ConfigModel) => Promise<ConfigModel | null>;
}

export const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);