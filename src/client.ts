import { ApiResponse } from "./types/common.js";

export interface HttpClientConfig {
  baseUrl?: string | undefined;
  apiKey: string;
  // Optional default token for customer-specific endpoints.
  userToken?: string | undefined;
}

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private userToken: string | undefined;

  constructor(config: HttpClientConfig) {
    if (config.baseUrl) {
      // Development — use the provided baseUrl, normalize trailing slash
      this.baseUrl = config.baseUrl.endsWith("/")
        ? config.baseUrl
        : `${config.baseUrl}/`;
    } else {
      // Production — requests resolve relative to the installed domain
      this.baseUrl = "/api/v1/";
    }

    this.apiKey = config.apiKey;
    this.userToken = config.userToken;
  }

  private isAbsoluteUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }

  /** Update the user token after login.
   * Called internally by ArtisApp.setUserToken()
   */
  setUserToken(token: string | undefined): void {
    this.userToken = token;
  }

  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // API key on every request — identifies the licensed developer
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
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)]),
        ).toString()
      : "";

    if (this.isAbsoluteUrl(this.baseUrl)) {
      const url = new URL(cleanPath, this.baseUrl);

      if (queryString) {
        url.search = queryString;
      }

      return url.toString();
    }

    const normalizedBase = this.baseUrl.startsWith("/")
      ? this.baseUrl
      : `/${this.baseUrl}`;
    const relativeUrl = `${normalizedBase.endsWith("/") ? normalizedBase : `${normalizedBase}/`}${cleanPath}`.replace(
      /\/+/g,
      "/",
    );

    return queryString ? `${relativeUrl}?${queryString}` : relativeUrl;
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
