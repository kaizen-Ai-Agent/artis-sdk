import { HttpClient } from "../client.js";
import { ApiResponse } from "../types/common.js";
import {
  User,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
  Token,
  UpdateProfilePayload,
} from "../types/auth.js";

export class AuthModule {
  constructor(private client: HttpClient) {}

  // POST /customer/login
  login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
    return this.client.post<LoginResponse>("/customer/login", payload);
  }

  // POST /customer/register
  register(payload: RegisterPayload): Promise<ApiResponse<RegisterResponse>> {
    return this.client.post<RegisterResponse>("/customer/register", payload);
  }

  // POST /customer/logout
  logout(): Promise<ApiResponse<void>> {
    return this.client.post<void>("/customer/logout");
  }

  // PATCH /customer/profile
  updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    return this.client.patch<User>("/customer/profile", payload);
  }

  // GET /customer/me
  // Fetch the currently authenticated user
  me(): Promise<ApiResponse<User>> {
    return this.client.get<User>("/customer/me");
  }

  // POST /customer/refresh
  // Get a fresh token using the current one
  refresh(): Promise<ApiResponse<Token>> {
    return this.client.post<Token>("/customer/refresh");
  }
}
