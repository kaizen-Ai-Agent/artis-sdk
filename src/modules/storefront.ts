import { HttpClient } from "../client.js";
import { HomePage, Category } from "../types/storefront.js";
import { ApiResponse, PaginatedData } from "../types/common.js";

export class StorefrontModule {
  constructor(private client: HttpClient) {}

  // GET /home
  getHome(): Promise<ApiResponse<HomePage>> {
    return this.client.get<HomePage>("/home");
  }

  // GET /categories
  getCategories(): Promise<ApiResponse<PaginatedData<Category>>> {
    return this.client.get<PaginatedData<Category>>("/categories");
  }

  // GET /gallery
  getGallery(): Promise<ApiResponse<PaginatedData<string>>> {
    return this.client.get<PaginatedData<string>>("/gallery");
  }
}
