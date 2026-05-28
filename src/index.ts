import { HttpClient } from "./client.js";
import { StorefrontModule } from "./modules/storefront.js";
import { ProductsModule } from "./modules/products.js";
import { AuthModule } from "./modules/auth.js";

export type ArtisEnv = "local" | "testing" | "prod" | "live";

export interface ArtisConfig {
  /** Your store's API base URL */
  baseUrl: string;
  /** Your API key — keep this in environment variables, never hardcode it */
  apiKey: string;
  /** Optional user token used for customer-specific endpoints */
  userToken?: string;
  /** Switches between test and production endpoints automatically */
  env?: ArtisEnv;
}

export class ArtisApp {
  public readonly storefront: StorefrontModule;
  public readonly products: ProductsModule;
  public readonly auth: AuthModule;

  constructor(config: ArtisConfig) {
    const clientConfig = {
      baseUrl: this.resolveBaseUrl(config),
      apiKey: config.apiKey,
    } as const;

    const client = new HttpClient(
      config.userToken !== undefined
        ? { ...clientConfig, userToken: config.userToken }
        : clientConfig,
    );

    this.storefront = new StorefrontModule(client);
    this.products = new ProductsModule(client);
    this.auth = new AuthModule(client);
  }

  private resolveBaseUrl(config: ArtisConfig): string {
    if (!config.env) return config.baseUrl;

    if (config.env === "local" || config.env === "testing") {
      try {
        const url = new URL(config.baseUrl);
        return `${url.protocol}//test-${url.host}${url.pathname}`;
      } catch {
        return config.baseUrl;
      }
    }

    return config.baseUrl; // prod / live
  }
}

/**
 * Initialize the Artis SDK. Call this once and reuse the returned instance.
 *
 * @example
 * import { initArtis } from 'artis-sdk'
 *
 * const app = initArtis({
 *   baseUrl: 'https://api.yourstore.com',
 *   apiKey: process.env.ARTIS_API_KEY,
 *   env: 'prod',
 * })
 *
 * const home = await app.storefront.getHome()
 * const products = await app.products.list({ page: 1 })
 */
export function initArtis(config: ArtisConfig): ArtisApp {
  return new ArtisApp(config);
}

export * from "./types/index.js";
export { ArtisApiError } from "./types/common.js";
