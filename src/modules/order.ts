import { HttpClient } from "../client.js";
import { ApiResponse } from "../types/common.js";
import { CreateOrderPayload, CreateOrderResponse } from "../types/order.js";

export class OrderModule {
	constructor(private client: HttpClient) {}

	// POST /orders
	create(payload: CreateOrderPayload): Promise<ApiResponse<CreateOrderResponse>> {
		return this.client.post<CreateOrderResponse>("/order", payload);
	}
}
