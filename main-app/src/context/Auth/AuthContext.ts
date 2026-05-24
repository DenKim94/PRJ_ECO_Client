import { createContext, RefObject } from 'react';
import { LogInRequest, RegisterRequest, 
  PasswordResetRequest, AuthResponseModel, 
  User, UserDataResponseModel, 
  ResponseMessage, AllUserDataResponse, 
  ApiMessageMap, ApiResponseMap, 
  UserNameUpdateRequest} from '../../types/AuthTypes'; 
import { MessageContainerProps } from '../../components/MessageContainer';


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
  responseMsg: MessageContainerProps | null;
  isTokenValid: () => boolean;
  resetResponseMsg: () => void;
  login: (request: LogInRequest) => Promise<AuthResponseModel | null>;
  logout: () => Promise<ApiMessageMap>;
  register: (request: RegisterRequest) => Promise<ApiResponseMap | null>;
  getUserData: () => Promise<UserDataResponseModel | null>;
  refreshToken: () => Promise<boolean>;
  setDeleteAccountRequested: (requested: boolean) => void;
  deleteAccount: () => Promise<ApiMessageMap>;
  updateUserNameWithLogout: (request: UserNameUpdateRequest) => Promise<ApiMessageMap>;
  resendVerificationEmail: () => Promise<ApiMessageMap>;
  verifyEmail: (tfaCode: string) => Promise<ApiMessageMap>;
  sendPasswordVerificationEmail: (request: {email: string}) => Promise<ApiMessageMap>;
  resetPassword: (request: PasswordResetRequest) => Promise<ApiMessageMap>;
  adminDeleteUserById: (userId: number) => Promise<ApiMessageMap>;
  adminSetUserStatusById: (userId: number, isEnabled: boolean) => Promise<ApiMessageMap>;
  adminGetAllUsers: () => Promise<boolean>;
  adminUpdatePassword: (newPassword: string) => Promise<ApiMessageMap>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);