/**
 * The shape every Artis API endpoint returns.
 * The SDK returns this envelope so callers can read status/message/data.
 */
export interface ApiResponse<T> {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: T;
}

/**
 * Interface for the pagination metadata.
 */
export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * Returned by any endpoint that paginates its results.
 * T is the item type, e.g. PaginatedData<Product>
 */
export interface PaginatedData<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * Optional helper for consumers who prefer throwing on API failures.
 * The SDK does not throw this by default.
 *
 * @example
 * import { ArtisApiError } from 'artis-sdk'
 * try {
 *   await app.products.getById(999)
 * } catch (err) {
 *   if (err instanceof ArtisApiError) {
 *     console.log(err.status)  // 404
 *     console.log(err.message) // "Product not found"
 *   }
 * }
 */
export class ArtisApiError extends Error {
  public readonly status: number;
  public readonly raw: ApiResponse<unknown>;

  constructor(response: ApiResponse<unknown>) {
    super(response.message);
    this.name = "ArtisApiError";
    this.status = response.status_code;
    this.raw = response;
  }
}
