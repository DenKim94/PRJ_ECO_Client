import { createContext } from 'react';
import { LogInRequest, RegisterRequest, PasswordResetRequest, AuthResponseModel, User, UserDataResponseModel } from '../../types/AuthTypes'; 


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
  getUserData: () => Promise<UserDataResponseModel | null>;
  // refreshToken: () => Promise<AuthResponseModel>;
  // deleteAccount: () => Promise<ApiMessageMap>;
  // verifyEmail: (tfaCode: string) => Promise<ApiMessageMap>;
  // resendVerificationEmail: () => Promise<ApiMessageMap>;
  // resetPassword: (request: PasswordResetRequest) => Promise<ApiMessageMap>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);