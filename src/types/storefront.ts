import type { Product } from "./products.js";

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description: string;
  primary_image: string;
  images: string[];
  is_active: boolean;
  sort_order: number;
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export interface HomePage {
  categories: Category[];
  featured_products: Product[];
  latest_products: Product[];
}
