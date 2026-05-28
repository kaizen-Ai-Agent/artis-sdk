export interface User {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  status: string;
  updated_at: string;
  created_at: string;
  id: number;
  fullname?: string;
  is_active?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  message?: string;
  user?: User;
  token?: TokenResponse;
}

export interface UpdateProfilePayload {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
}
