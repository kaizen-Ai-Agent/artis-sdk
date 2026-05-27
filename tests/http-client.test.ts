import { describe, it, expect, vi, afterEach } from "vitest";
import { ArtisApiError } from "../src/types/common.js";
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
    expect(data).toEqual(okResponse.data);
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": "test-key",
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

  it("throws ArtisApiError on failed responses", async () => {
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

    await expect(client.get("/products/999")).rejects.toBeInstanceOf(
      ArtisApiError,
    );
  });
});
