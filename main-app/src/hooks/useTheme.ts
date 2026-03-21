import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../context/Theme/ThemeContext';

export const useTheme = () : ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme muss innerhalb eines ThemeProvider verwendet werden!');
  }
  return context;
};