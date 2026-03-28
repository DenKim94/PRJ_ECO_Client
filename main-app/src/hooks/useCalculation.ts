import { useContext } from 'react';
import { CalculationContext, CalculationContextType } from '../context/Calculation/CalculationContext';

export const useCalculation = (): CalculationContextType => {
  const context = useContext(CalculationContext);
  
  if (!context) {
    throw new Error('useCalculation muss innerhalb eines CalculationProvider verwendet werden!');
  }
  return context;
};