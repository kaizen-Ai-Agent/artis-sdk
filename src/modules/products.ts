import { HttpClient } from "../client.js";
import { Product, ProductListParams } from "../types/products.js";
import { PaginatedData } from "../types/common.js";

export class ProductsModule {
  constructor(private client: HttpClient) {}

  list(params?: ProductListParams): Promise<PaginatedData<Product>> {
    return this.client.get<PaginatedData<Product>>(
      "/products",
      params as Record<string, string | number | boolean>,
    );
  }

  getById(id: number): Promise<Product> {
    return this.client.get<Product>(`/products/${id}`);
  }

  getBySlug(slug: string): Promise<Product> {
    return this.client.get<Product>(`/products/slug/${slug}`);
  }

  search(
    query: string,
    params?: Omit<ProductListParams, "search">,
  ): Promise<PaginatedData<Product>> {
    return this.client.get<PaginatedData<Product>>("/products/search", {
      q: query,
      ...(params as Record<string, string | number | boolean>),
    });
  }

  getFeatured(): Promise<Product[]> {
    return this.client.get<Product[]>("/products/featured");
  }

  getLatest(): Promise<Product[]> {
    return this.client.get<Product[]>("/products/latest");
  }
}
