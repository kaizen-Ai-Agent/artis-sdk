import { describe, it, expect, vi, afterEach } from "vitest";
import { ApiResponse } from "../src/types/common.js";
import { HttpClient } from "../src/client.js";

const okResponse = {
  success: true,
  status: 200,
  message: "ok",
  data: {
    id: 101,
    name: "Mock Product",
    price: 49.99,
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HttpClient", () => {
  it("builds URLs with params and sends headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => okResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });

    const data = await client.get("/products", { page: 1, featured: true });

    console.log("HttpClient.get mock data:", data);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const parsed = new URL(url);

    expect(parsed.pathname).toBe("/products");
    expect(parsed.searchParams.get("page")).toBe("1");
    expect(parsed.searchParams.get("featured")).toBe("true");
    expect(init.method).toBe("GET");
    expect(data).toEqual(okResponse);
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": "test-key",
    });
  });

  it("uses default user token when configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => okResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
      userToken: "default-token",
    });

    await client.get("/me");

    const firstInit = fetchMock.mock.calls[0][1] as RequestInit;

    expect(firstInit.headers).toMatchObject({
      Authorization: "Bearer default-token",
    });
  });

  it("sends JSON bodies only when provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => okResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });

    await client.post("/orders", { id: 123 });
    await client.post("/orders");

    const firstInit = fetchMock.mock.calls[0][1] as RequestInit;
    const secondInit = fetchMock.mock.calls[1][1] as RequestInit;

    expect(firstInit.body).toBe(JSON.stringify({ id: 123 }));
    expect(secondInit.body).toBeUndefined();
  });

  it("returns error envelope for failed responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        success: false,
        status: 404,
        message: "Not found",
        data: null,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });

    const data = await client.get<ApiResponse<null>>("/products/999");

    expect(data.success).toBe(false);
    expect(data.status).toBe(404);
  });
});
