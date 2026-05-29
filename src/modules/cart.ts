import { HttpClient } from "../client.js";
import { ApiResponse } from "../types/common.js";
import {
  CartCalculatePayload,
  CartCalculationResponse,
} from "../types/cart.js";

export class CartModule {
  constructor(private client: HttpClient) {}

  // POST /cart/calculate
  calculate(
    payload: CartCalculatePayload,
  ): Promise<ApiResponse<CartCalculationResponse>> {
    return this.client.post<CartCalculationResponse>(
      "/cart/calculate",
      payload,
    );
  }
}
