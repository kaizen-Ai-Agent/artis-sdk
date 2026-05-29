// ─── Cart items ───────────────────────────────────────────────────────────────────

export interface CartItemInput {
  product_id: number;
  quantity: number;
}

// ─── Cart calculated items ───────────────────────────────────────────────────────────────────

export interface CartCalculatedItem {
  product_id: number;
  name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  image_url: string;
}

// ─── Cart summary ───────────────────────────────────────────────────────────────────

export interface CartSummary {
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
}

// ─── Cart payloads ───────────────────────────────────────────────────────────────────

export interface CartCalculatePayload {
  items: CartItemInput[];
  delivery_type: string;
}

// ─── Cart responses ───────────────────────────────────────────────────────────────────

export interface CartCalculationResponse {
  items: CartCalculatedItem[];
  summary: CartSummary;
}
