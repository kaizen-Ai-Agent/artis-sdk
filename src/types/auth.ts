// ─── User ─────────────────────────────────────────────────────────────────────

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

// ─── Token ─────────────────────────────────────────────────────────────────────

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// ─── Auth payloads ────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
}

export interface ResetPasswordPayload {
  otp: number;
  email: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface SendOtp {
  type: "password_reset" | "verification";
  email: string;
}

export interface VerifyAccount {
  otp: number;
}

// ─── Auth responses ────────────────────────────────────────────────────────────

export interface RegisterResponse {
  user: User;
  token: Token;
}

export interface LoginResponse {
  token: Token;
}
