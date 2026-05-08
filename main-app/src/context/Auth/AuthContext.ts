import { createContext, RefObject } from 'react';
import { LogInRequest, RegisterRequest, 
  PasswordResetRequest, AuthResponseModel, 
  User, UserDataResponseModel, 
  ResponseMessage, AllUserDataResponse, 
  ApiMessageMap, ApiResponseMap } from '../../types/AuthTypes'; 


export interface AuthContextType {
  user: User | null;
  userDetailedData: UserDataResponseModel | null;
  adminUserData: AllUserDataResponse[];
  isAuthenticated: boolean;
  showSessionWarning: boolean;
  sessionTimeRemaining: RefObject<number>;
  isLoading: boolean;
  deleteAccountRequested: boolean;
  errorMsgRef: RefObject<ResponseMessage | undefined>;
  isTokenValid: () => boolean;
  login: (request: LogInRequest) => Promise<AuthResponseModel | null>;
  logout: () => Promise<ApiMessageMap>;
  register: (request: RegisterRequest) => Promise<ApiResponseMap | null>;
  getUserData: () => Promise<UserDataResponseModel | null>;
  refreshToken: () => Promise<boolean>;
  setDeleteAccountRequested: (requested: boolean) => void;
  deleteAccount: () => Promise<ApiMessageMap>;
  resendVerificationEmail: () => Promise<ApiMessageMap>;
  verifyEmail: (tfaCode: string) => Promise<ApiMessageMap>;
  sendPasswordVerificationEmail: (request: {email: string}) => Promise<ApiMessageMap>;
  resetPassword: (request: PasswordResetRequest) => Promise<ApiMessageMap>;
  adminDeleteUserById: (userId: number) => Promise<ApiMessageMap>;
  adminSetUserStatusById: (userId: number, isEnabled: boolean) => Promise<ApiMessageMap>;
  adminGetAllUsers: () => Promise<AllUserDataResponse[]>;
  adminUpdatePassword: (newPassword: string) => Promise<ApiMessageMap>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);