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
}