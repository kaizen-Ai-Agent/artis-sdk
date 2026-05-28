import { HttpClient } from "../client.js";
import { Product, ProductListParams } from "../types/products.js";
import { ApiResponse, PaginatedData } from "../types/common.js";

export class ProductsModule {
  constructor(private client: HttpClient) {}

  // GET /products
  // Supports pagination, filtering, and sorting via query parameters
  list(
    params?: ProductListParams,
  ): Promise<ApiResponse<PaginatedData<Product>>> {
    return this.client.get<PaginatedData<Product>>(
      "/products",
      params as Record<string, string | number | boolean>,
    );
  }

  // GET /products/:id
  getById(id: number): Promise<ApiResponse<Product>> {
    return this.client.get<Product>(`/products/${id}`);
  }

  // GET /products/slug/:slug
  getBySlug(slug: string): Promise<ApiResponse<Product>> {
    return this.client.get<Product>(`/products/slug/${slug}`);
  }

  // GET /products/search?q=...
  // Supports the same pagination, filtering, and sorting parameters as list()
  search(
    query: string,
    params?: Omit<ProductListParams, "search">,
  ): Promise<ApiResponse<PaginatedData<Product>>> {
    return this.client.get<PaginatedData<Product>>("/products/search", {
      q: query,
      ...(params as Record<string, string | number | boolean>),
    });
  }

  // GET /products/featured
  getFeatured(): Promise<ApiResponse<Product[]>> {
    return this.client.get<Product[]>("/products/featured");
  }

  // GET /products/latest
  getLatest(): Promise<ApiResponse<Product[]>> {
    return this.client.get<Product[]>("/products/latest");
  }
}
