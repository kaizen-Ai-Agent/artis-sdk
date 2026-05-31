import { HttpClient } from "./client.js";
import { StorefrontModule } from "./modules/storefront.js";
import { ProductsModule } from "./modules/products.js";
import { AuthModule } from "./modules/auth.js";
import { OrderModule } from "./modules/order.js";
import { BusinessModule } from "./modules/business.js";
import { CartModule } from "./modules/cart.js";
import { BookingModule } from "./modules/booking.js";

export interface ArtisConfig {
  /**
   * Your API base URL — only needed during development.
   * In production this is omitted and requests go to /api/v1/ relative
   * to whatever domain the template is installed on.
   *
   * @example
   * // Development
   * const app = initArtis({
   *   baseUrl: 'https://dev.yourstore.com',
   *   apiKey: 'your-api-key',
   * })
   *
   * // Production — omit baseUrl entirely
   * const app = initArtis({
   *   apiKey: 'your-api-key',
   * })
   */
  baseUrl?: string;
  /** Your API key — identifies you as a licensed developer on every request */
  apiKey: string;
  /**
   * Optional customer token for authenticated endpoints (me, updateProfile, etc).
   * You can also set this after init using app.setUserToken() — useful after login.
   *
   * @example
   * const app = initArtis({
   *   apiKey: '...',
   *   userToken: localStorage.getItem('artis_token') ?? undefined,
   * })
   */
  userToken?: string;
}

export class ArtisApp {
  public readonly storefront: StorefrontModule;
  public readonly products: ProductsModule;
  public readonly auth: AuthModule;
  public readonly business: BusinessModule;
  public readonly orders: OrderModule;
  public readonly cart: CartModule;
  public readonly bookings: BookingModule;

  private client: HttpClient;

  constructor(config: ArtisConfig) {
    this.client = new HttpClient({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      userToken: config.userToken,
    });

    this.storefront = new StorefrontModule(this.client);
    this.products = new ProductsModule(this.client);
    this.auth = new AuthModule(this.client);
    this.business = new BusinessModule(this.client);
    this.orders = new OrderModule(this.client);
    this.cart = new CartModule(this.client);
    this.bookings = new BookingModule(this.client);
  }

  /**
   * Attach a user token after login so all subsequent requests go out authenticated.
   * You are responsible for persisting the token — the SDK only holds it in memory.
   *
   * @example
   * const res = await app.auth.login({ email, password })
   * if (res.success) {
   *   app.setUserToken(res.data.token.access_token)
   *   localStorage.setItem('artis_token', res.data.token.access_token)
   * }
   */
  setUserToken(token: string): void {
    this.client.setUserToken(token);
  }

  /**
   * Remove the user token. Call this on logout.
   * You are responsible for removing the token from your own storage as well.
   *
   * @example
   * await app.auth.logout()
   * app.clearUserToken()
   * localStorage.removeItem('artis_token')
   */
  clearUserToken(): void {
    this.client.setUserToken(undefined);
  }
}

/**
 * Initialize the Artis SDK. Call this once and reuse the returned instance.
 *
 * @example
 * // Development
 * const app = initArtis({
 *   baseUrl: 'https://dev.yourstore.com',
 *   apiKey: process.env.ARTIS_API_KEY,
 * })
 *
 * // Production — no baseUrl, requests go to /api/v1/ on the installed domain
 * const app = initArtis({
 *   apiKey: process.env.ARTIS_API_KEY,
 * })
 */
export function initArtis(config: ArtisConfig): ArtisApp {
  return new ArtisApp(config);
}

export * from "./types/index.js";
export { ArtisApiError } from "./types/common.js";
