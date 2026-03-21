import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/Auth/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProvider verwendet werden!');
  }
  return context;
};