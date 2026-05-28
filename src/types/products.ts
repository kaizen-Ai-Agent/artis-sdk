// ─── Product ────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  display_price: string;
  category: string;
  tags: string[];
  track_stock: boolean;
  stock_mode: string;
  base_unit: string | null;
  stock_base: string;
  is_available: boolean;
  is_featured: boolean;
  is_addon: boolean;
  can_be_sold_alone: boolean;
  images: ProductImage[];
  primary_image: string;
  variant_groups: unknown[];
  variant_combinations: unknown[];
}

export interface ProductImage {
  url: string;
  is_primary: boolean;
  sort_order: number;
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface ProductListParams {
  featured?: boolean;
  category?: string;
  page?: number;
  q?: string;
}
