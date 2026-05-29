import { describe, it, expect, vi, afterEach } from "vitest";
import { AuthModule } from "../src/modules/auth.js";
import { HttpClient } from "../src/client.js";

const okResponse = {
  success: true,
  status: "success",
  status_code: 200,
  message: "ok",
  data: {
    token: {
      access_token: "token-123",
      token_type: "Bearer",
      expires_in: 3600,
    },
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AuthModule", () => {
  it("login returns token envelope", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => okResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpClient({
      baseUrl: "https://api.example.com",
      apiKey: "test-key",
    });
    const auth = new AuthModule(client);

    const res = await auth.login({
      email: "john@example.com",
      password: "password",
    });

    expect(res).toEqual(okResponse);
  });
});
