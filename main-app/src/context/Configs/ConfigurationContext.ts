import { createContext } from 'react';
import { ConfigModel } from '../../types/ConfigTypes';

/** 
 * * configs: ConfigModel | null;
 * * getConfiguration: () => Promise<ConfigModel | null>;
 * * updateConfiguration: (request: ConfigModel) => Promise<ConfigModel | null>;
*/
export interface ConfigurationContextType {
    configs: ConfigModel | null;
    getConfiguration: () => Promise<ConfigModel | null>;
    updateConfiguration: (request: ConfigModel) => Promise<ConfigModel | null>;
}

export const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);