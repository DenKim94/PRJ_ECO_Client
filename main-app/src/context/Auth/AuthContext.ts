import { createContext } from 'react';
import { LogInRequest, RegisterRequest, PasswordResetRequest, AuthResponseModel } from '../../types/AuthTypes'; 

export type UserRoles = 'USER' | 'ADMIN';

export interface User {
  name: string;
  role: UserRoles;
  hasValidStatus: boolean;
}

export type ApiResponseMap = Record<string, object>; 
export type ApiMessageMap = Record<string, string>;

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  showSessionWarning: boolean;
  isLoading: boolean;
  errorMsg: string | undefined;
  login: (request: LogInRequest) => Promise<AuthResponseModel | null>;
  logout: () => Promise<ApiMessageMap>;
  register: (request: RegisterRequest) => Promise<ApiResponseMap | null>;
  // refreshToken: () => Promise<AuthResponseModel>;
  // deleteAccount: () => Promise<ApiMessageMap>;
  // verifyEmail: (tfaCode: string) => Promise<ApiMessageMap>;
  // resendVerificationEmail: () => Promise<ApiMessageMap>;
  // resetPassword: (request: PasswordResetRequest) => Promise<ApiMessageMap>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);