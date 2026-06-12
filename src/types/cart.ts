// ─── Cart items ───────────────────────────────────────────────────────────────────

export interface CartItemInput {
  product_id: number;
  quantity: number;
}

export interface CartItemAddonInput {
  product_id: number;
  quantity: number;
  variant_combination_id: number;
}

export interface CartCreateItemInput extends CartItemInput {
  customizations?: string[];
  addons?: CartItemAddonInput[];
}

export interface CartUpdatePayload {
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

// ─── Cart items ───────────────────────────────────────────────────────────────────

export interface CartVariant {
  id: number;
  sku: string;
  additional_price: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: number;
  product_name: string;
  product_slug?: string;
  image_url: string;
  unit_price: string | number;
  quantity: number;
  line_total: number;
  customizations: string[];
  parent_item_id: string | null;
  variant: CartVariant | null;
  stock_status: string;
  created_at: string;
  updated_at: string;
  addons?: CartItem[];
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

export interface CartCreatePayload {
  items: CartCreateItemInput[];
}

// ─── Cart responses ───────────────────────────────────────────────────────────────────

export interface CartCalculationResponse {
  items: CartCalculatedItem[];
  summary: CartSummary;
}

export interface CartCreateResponseData {
  id: string;
  items: CartItem[];
  summary: {
    subtotal: number;
  };
}

export interface CartCreateResponse {
  data: CartCreateResponseData;
}

export interface CartUpdateResponse {
  data: CartItem;
}

export interface CartDeleteResponse {
  data: CartItem;
}
