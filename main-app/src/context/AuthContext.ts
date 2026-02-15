import { createContext } from 'react';

export type UserRoles = 'USER' | 'ADMIN';

export interface User {
  name: string;
  role: UserRoles;
  hasValidStatus: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, expiresInMs: number) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  showSessionWarning: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);