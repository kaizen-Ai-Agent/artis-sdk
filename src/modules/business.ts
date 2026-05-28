import { HttpClient } from "../client.js";
import { ApiResponse } from "../types/common.js";
import { Settings } from "../types/business.js";

export class BusinessModule {
  constructor(private client: HttpClient) {}

  // GET /settings
  getSettings(): Promise<ApiResponse<Settings>> {
    return this.client.get<Settings>("/settings");
  }
}
