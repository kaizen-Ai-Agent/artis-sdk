import { HttpClient } from "../client.js";
import {
  User,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.js";
import { ApiResponse } from "../types/common.js";

export class AuthModule {
  constructor(private client: HttpClient) {}

  // POST /customer/login
  login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthResponse>("/customer/login", payload);
  }

  // POST /customer/register
  register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthResponse>("/customer/register", payload);
  }

  // POST /customer/logout
  logout(): Promise<ApiResponse<void>> {
    return this.client.post<void>("/customer/logout");
  }

  // PATCH /customer/profile
  updateProfile(payload: Partial<User>): Promise<ApiResponse<User>> {
    return this.client.patch<User>("/customer/profile", payload);
  }

  // GET /customer/me
  // Fetch the currently authenticated user
  me(): Promise<ApiResponse<User>> {
    return this.client.get<User>("/customer/me");
  }

  // POST /customer/refresh
  // Get a fresh token using the current one
  refresh(): Promise<ApiResponse<AuthResponse>> {
    return this.client.post<AuthResponse>("/customer/refresh");
  }
}
