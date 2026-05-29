import { HttpClient } from "../client.js";
import { ApiResponse } from "../types/common.js";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  MyOrder,
  OrderTrackingResponse,
} from "../types/order.js";

export class OrderModule {
  constructor(private client: HttpClient) {}

  // POST /orders
  create(
    payload: CreateOrderPayload,
  ): Promise<ApiResponse<CreateOrderResponse>> {
    return this.client.post<CreateOrderResponse>("/orders", payload);
  }

  // GET /orders/:reference/track
  track(reference: string): Promise<ApiResponse<OrderTrackingResponse>> {
    return this.client.get<OrderTrackingResponse>(`/orders/${reference}/track`);
  }

  // GET /my-orders
  myOrders(): Promise<ApiResponse<MyOrder[]>> {
    return this.client.get<MyOrder[]>("/my-orders");
  }
}
