
export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  email_verified: boolean;
  email_notifications_enabled: boolean;
}

export interface ApiError {
  error: string;
  status: number;
}