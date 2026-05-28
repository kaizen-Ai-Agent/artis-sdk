/**
 * The shape every Artis API endpoint returns.
 * The SDK returns this envelope so callers can read status/message/data.
 */
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

/**
 * Returned by any endpoint that paginates its results.
 * T is the item type, e.g. PaginatedData<Product>
 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
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
    this.status = response.status;
    this.raw = response;
  }
}
