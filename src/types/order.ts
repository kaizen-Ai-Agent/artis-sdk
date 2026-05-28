// ─── Order items ─────────────────────────────────────────────────────────────────────

export interface OrderItemAddon {
  product_id: number;
  variant_combination_id: number;
  quantity: number;
}

export interface OrderItem {
  product_id: number;
  variant_combination_id: number;
  quantity: number;
  customizations?: unknown[];
  addons?: OrderItemAddon[];
}

// ─── Order payloads ─────────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: string;
  delivery_address: string;
  delivery_date: string;
  payment_channel: string;
  items: OrderItem[];
}

// ─── Order responses ─────────────────────────────────────────────────────────────────────

export interface CreateOrderResponse {
  order_number: string;
  reference: string;
  checkout_url: string;
  instructions: string | null;
  gateway: string;
}
