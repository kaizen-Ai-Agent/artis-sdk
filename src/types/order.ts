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

// ─── Order tracking ───────────────────────────────────────────────────────────────────

export interface OrderTrackingItem {
  product_name: string;
  quantity: number;
  unit_price: string;
  total: string;
  customizations: Record<string, string> | null;
}

export interface OrderTrackingTimelineEntry {
  status: string;
  label: string;
  date: string | null;
  completed: boolean;
  is_current: boolean;
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

export interface OrderTrackingResponse {
  order_number: string;
  customer_name: string;
  customer_email: string;
  type: string;
  status: string;
  payment_status: string;
  payment_reference: string | null;
  gateway: string;
  delivery_type: string;
  delivery_address: string;
  delivery_date: string;
  subtotal: string;
  delivery_fee: string;
  total: string;
  items: OrderTrackingItem[];
  timeline: OrderTrackingTimelineEntry[];
}

export type MyOrder = Record<string, unknown>;
