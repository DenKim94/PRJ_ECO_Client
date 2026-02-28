export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface PasswordResetRequest {
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
}

export type UserRoles = 'USER' | 'ADMIN';

export interface User {
  name: string;
  role: UserRoles;
  hasValidStatus: boolean;
}

export interface UserDataResponseModel extends User {
  id: string;
  email: string;
  createdAt: string;
}
