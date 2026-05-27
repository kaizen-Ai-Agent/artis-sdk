import { ApiResponse, ArtisApiError } from "./types/common.js";

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
}

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: HttpClientConfig) {
    // Normalize baseUrl so it always has a trailing slash
    this.baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl
      : `${config.baseUrl}/`;
    this.apiKey = config.apiKey;
  }

  private buildHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      // X-API-Key is the standard header for API keys.
      // This is different from Authorization: Bearer which is for user tokens.
      "X-API-Key": this.apiKey,
    };
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

  // Unwraps the ApiResponse envelope and returns data directly.
  // Throws ArtisApiError if success is false so callers can catch it cleanly.
  private async handleResponse<T>(response: Response): Promise<T> {
    const json: ApiResponse<T> = await response.json();

    if (!json.success) {
      throw new ArtisApiError(json);
    }

    return json.data;
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<T> {
    const response = await fetch(this.buildUrl(path, params), {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(
      this.buildUrl(path),
      this.buildJsonInit("POST", body),
    );
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(
      this.buildUrl(path),
      this.buildJsonInit("PUT", body),
    );
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(
      this.buildUrl(path),
      this.buildJsonInit("PATCH", body),
    );
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(this.buildUrl(path), {
      method: "DELETE",
      headers: this.buildHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}
