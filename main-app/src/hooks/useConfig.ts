import { useContext } from 'react';
import { ConfigurationContext, ConfigurationContextType } from '../context/Configs/ConfigurationContext';

export const useConfig = (): ConfigurationContextType => {
  const context = useContext(ConfigurationContext);
  
  if (!context) {
    throw new Error('useConfig muss innerhalb eines ConfigurationProvider verwendet werden!');
  }
  return context;
};