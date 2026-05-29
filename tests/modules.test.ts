import { describe, it, expect, vi, afterEach } from "vitest";
import { ProductsModule } from "../src/modules/products.js";
import { HttpClient } from "../src/client.js";

const okResponse = {
  success: true,
  status: "success",
  status_code: 200,
  message: "ok",
  data: {
    data: [
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
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 1,
    },
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

    const data = await products.list({ page: 2, featured: true });

    console.log("ProductsModule.list mock data:", data);

    // Verify query params were sent as expected.
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    const parsed = new URL(url);

    expect(parsed.pathname).toBe("/products");
    expect(parsed.searchParams.get("page")).toBe("2");
    expect(parsed.searchParams.get("featured")).toBe("true");
    expect(data).toEqual(okResponse);
  });
});
