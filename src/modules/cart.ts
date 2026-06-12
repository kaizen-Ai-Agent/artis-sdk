import { HttpClient } from "../client.js";
import { ApiResponse } from "../types/common.js";
import {
  CartCreatePayload,
  CartCreateResponse,
  CartCalculatePayload,
  CartCalculationResponse,
  CartDeleteResponse,
  CartUpdatePayload,
  CartUpdateResponse,
} from "../types/cart.js";

export class CartModule {
  constructor(private client: HttpClient) {}

  // POST /cart/create
  create(payload: CartCreatePayload): Promise<ApiResponse<CartCreateResponse>> {
    return this.client.post<CartCreateResponse>("/cart/create", payload);
  }

  // POST /cart/calculate
  calculate(
    payload: CartCalculatePayload,
  ): Promise<ApiResponse<CartCalculationResponse>> {
    return this.client.post<CartCalculationResponse>(
      "/cart/calculate",
      payload,
    );
  }

  // PUT /cart/:id
  update(
    id: string,
    payload: CartUpdatePayload,
  ): Promise<ApiResponse<CartUpdateResponse>> {
    return this.client.put<CartUpdateResponse>(`/cart/${id}`, payload);
  }

  // DELETE /cart/:id
  delete(id: string): Promise<ApiResponse<CartDeleteResponse>> {
    return this.client.delete<CartDeleteResponse>(`/cart/${id}`);
  }
}
