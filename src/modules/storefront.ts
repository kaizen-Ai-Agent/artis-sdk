import { HttpClient } from "../client.js";
import { HomePage, Category } from "../types/storefront.js";
import { PaginatedData } from "../types/common.js";
import { Product } from "../types/products.js";

export class StorefrontModule {
  constructor(private client: HttpClient) {}

  getHome(): Promise<HomePage> {
    return this.client.get<HomePage>("/home");
  }

  getCategories(): Promise<Category[]> {
    return this.client.get<Category[]>("/categories");
  }

  getCategory(id: number): Promise<Category> {
    return this.client.get<Category>(`/categories/${id}`);
  }

  getCategoryBySlug(slug: string): Promise<Category> {
    return this.client.get<Category>(`/categories/slug/${slug}`);
  }

  getCategoryProducts(
    id: number,
    params?: { page?: number; per_page?: number },
  ): Promise<PaginatedData<Product>> {
    return this.client.get<PaginatedData<Product>>(
      `/categories/${id}/products`,
      params as Record<string, number>,
    );
  }
}
