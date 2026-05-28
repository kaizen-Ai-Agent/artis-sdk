import { ApiResponse } from "./types/common.js";

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  // Optional default token for customer-specific endpoints.
  userToken?: string;
}

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private userToken: string | undefined;

  constructor(config: HttpClientConfig) {
    // Normalize baseUrl so it always has a trailing slash
    this.baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    this.apiKey = config.apiKey;
    this.userToken = config.userToken;
  }

  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // API key always goes on every request — identifies the store
      "X-API-Key": this.apiKey,
    };

    if (this.userToken) {
      headers["Authorization"] = `Bearer ${this.userToken}`;
    }

    return headers;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(cleanPath, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private buildJsonInit(method: string, body?: unknown): RequestInit {
    const init: RequestInit = {
      method,
      headers: this.buildHeaders(),
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    return init;
  }

  // Returns the ApiResponse envelope so callers can inspect status/message.
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const json: ApiResponse<T> = await response.json();

    return json;
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(this.buildUrl(path, params), {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(
      this.buildUrl(path),
      this.buildJsonInit("POST", body),
    );
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(
      this.buildUrl(path),
      this.buildJsonInit("PUT", body),
    );
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(
      this.buildUrl(path),
      this.buildJsonInit("PATCH", body),
    );
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(this.buildUrl(path), {
      method: "DELETE",
      headers: this.buildHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}
