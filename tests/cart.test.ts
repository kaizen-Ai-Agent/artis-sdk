import { describe, it, expect, vi, afterEach } from "vitest";
import { CartModule } from "../src/modules/cart.js";
import { HttpClient } from "../src/client.js";

const createResponse = {
  success: true,
  status: "success",
  status_code: 200,
  message: "Items added to cart successfully.",
  data: {
    success: true,
    data: {
      id: "cart-1",
      items: [],
      summary: {
        subtotal: 226500,
      },
    },
  },
};

const updateResponse = {
  success: true,
  status: "success",
  status_code: 200,
  message: "Cart updated.",
  data: {
    success: true,
    data: {
      id: "item-1",
      cart_id: "cart-1",
      product_id: 5,
      product_name: "Orange Juice",
      product_slug: "orange-juice",
      image_url: "https://cdn.example.com/orange-juice.png",
      unit_price: 500,
      quantity: 5,
      line_total: 2500,
      customizations: [],
      parent_item_id: "parent-1",
      variant: {
        id: 121,
        sku: "ORANG-S",
        additional_price: "0.00",
      },
      stock_status: "in-stock",
      created_at: "2026-06-07T11:58:50.000000Z",
      updated_at: "2026-06-07T12:09:03.000000Z",
    },
  },
};

const deleteResponse = {
  success: true,
  status: "success",
  status_code: 200,
  message: "Cart item deleted.",
  data: {
    data: {
      id: "item-1",
      cart_id: "cart-1",
      product_id: 5,
      product_name: "Orange Juice",
      product_slug: "orange-juice",
      image_url: "https://cdn.example.com/orange-juice.png",
      unit_price: 500,
      quantity: 5,
      line_total: 2500,
      customizations: [],
      parent_item_id: "parent-1",
      variant: {
        id: 121,
        sku: "ORANG-S",
        additional_price: "0.00",
      },
      stock_status: "in-stock",
      created_at: "2026-06-07T11:58:50.000000Z",
      updated_at: "2026-06-07T12:09:03.000000Z",
    },
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CartModule", () => {
  it("create posts the cart payload to /cart/create", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => createResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });
    const cart = new CartModule(client);

    const payload = {
      items: [
        {
          product_id: 1,
          quantity: 3,
          customizations: ["Classic Elegant"],
          addons: [
            {
              product_id: 5,
              quantity: 3,
              variant_combination_id: 121,
            },
          ],
        },
      ],
    };

    const res = await cart.create(payload);

    expect(res).toEqual(createResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.com/cart/create");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify(payload));
  });

  it("update puts the quantity to /cart/:id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => updateResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });
    const cart = new CartModule(client);

    const res = await cart.update("item-1", { quantity: 5 });

    expect(res).toEqual(updateResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.com/cart/item-1");
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ quantity: 5 }));
  });

  it("delete removes a cart item at /cart/:id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => deleteResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });
    const cart = new CartModule(client);

    const res = await cart.delete("item-1");

    expect(res).toEqual(deleteResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.com/cart/item-1");
    expect(init.method).toBe("DELETE");
  });
});
