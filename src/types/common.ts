/**
 * The shape every Artis API endpoint returns.
 * The HttpClient unwraps this automatically, so module methods
 * just return T — callers never deal with this wrapper directly.
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
 * Thrown when the API returns success: false.
 * Catch this to read a human-readable message and HTTP status code.
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
