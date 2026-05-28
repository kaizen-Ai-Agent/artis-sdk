import { HttpClient } from "../client.js";
import { HomePage, Category } from "../types/storefront.js";
import { ApiResponse, PaginatedData } from "../types/common.js";
import { Product } from "../types/products.js";

export class StorefrontModule {
  constructor(private client: HttpClient) {}

  // GET /home
  getHome(): Promise<ApiResponse<HomePage>> {
    return this.client.get<HomePage>("/home");
  }

  // GET /categories
  getCategories(): Promise<ApiResponse<Category[]>> {
    return this.client.get<Category[]>("/categories");
  }

  // GET /categories/:id
  getCategory(id: number): Promise<ApiResponse<Category>> {
    return this.client.get<Category>(`/categories/${id}`);
  }

  // GET /categories/slug/:slug
  getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return this.client.get<Category>(`/categories/slug/${slug}`);
  }

  // GET /categories/:id/products
  getCategoryProducts(
    id: number,
    params?: { page?: number; per_page?: number },
  ): Promise<ApiResponse<PaginatedData<Product>>> {
    return this.client.get<PaginatedData<Product>>(
      `/categories/${id}/products`,
      params as Record<string, number>,
    );
  }
}
