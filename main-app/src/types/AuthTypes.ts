export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface PasswordResetRequest {
  email: string;
  newPassword: string;
  tfaCode: string;
}

export interface LogInRequest {
  username: string;
  password: string;
}

export interface AuthResponseModel {
  token: string;
  expiresIn: number;
  userName: string;
  role: string;
  hasValidStatus: boolean;
}

export type ApiResponseMap = Record<string, object>; 
export type ApiMessageMap = Record<string, string>;

export type UserRoles = 'USER' | 'ADMIN';

export interface User {
  name: string;
  role: UserRoles;
  hasValidStatus: boolean;
}

export interface UserDataResponseModel{
  name: string;
  role: UserRoles;
  email: string;
  createdAt: string;
  isEnabled: boolean;
  isValidatedEmail: boolean;
}

export interface ResponseMessage {
  code?: number;
  message: string;
}

export interface AllUserDataResponse {
  id: number;
  userName: string;
  eMail: string;
  isEnabledUser: boolean;
  isValidatedEmail: boolean;
  createdAt: string;
};
