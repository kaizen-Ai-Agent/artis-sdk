import { StorefrontModule } from "../src/modules/storefront.js";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ProductsModule } from "../src/modules/products.js";
import { HttpClient } from "../src/client.js";

const okResponse = {
  success: true,
  status: 200,
  message: "ok",
  data: {
    items: [
      {
        id: 1,
        name: "Mock Tee",
        slug: "mock-tee",
        description: "Mock description",
        short_description: "Mock short",
        price: 24.99,
        compare_price: null,
        primary_image: "https://cdn.example.com/mock-tee.jpg",
        images: [],
        variants: [],
        category_id: 10,
        is_active: true,
        is_featured: false,
        stock: 10,
        sku: "MOCK-TEE",
        meta: { title: "Mock Tee", description: "Mock meta" },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      },
    ],
    total: 1,
    page: 1,
    per_page: 20,
    last_page: 1,
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Modules", () => {
  it("ProductsModule.list forwards query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => okResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });
    const products = new ProductsModule(client);

    const data = await products.list({ page: 2, per_page: 10, featured: true });

    console.log("ProductsModule.list mock data:", data);

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    const parsed = new URL(url);

    expect(parsed.pathname).toBe("/products");
    expect(parsed.searchParams.get("page")).toBe("2");
    expect(parsed.searchParams.get("per_page")).toBe("10");
    expect(parsed.searchParams.get("featured")).toBe("true");
    expect(data).toEqual(okResponse);
  });

  it("StorefrontModule.getCategoryProducts forwards page params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => okResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });
    const storefront = new StorefrontModule(client);

    const data = await storefront.getCategoryProducts(12, {
      page: 3,
      per_page: 24,
    });

    console.log("StorefrontModule.getCategoryProducts mock data:", data);

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    const parsed = new URL(url);

    expect(parsed.pathname).toBe("/categories/12/products");
    expect(parsed.searchParams.get("page")).toBe("3");
    expect(parsed.searchParams.get("per_page")).toBe("24");
    expect(data).toEqual(okResponse);
  });
});
