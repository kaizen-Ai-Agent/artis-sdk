export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  compare_price: number | null;
  stock: number;
  sku: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price: number | null; // null when there is no discount
  primary_image: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category_id: number;
  is_active: boolean;
  is_featured: boolean;
  stock: number;
  sku: string;
  meta: {
    title: string;
    description: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductListParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  search?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  featured?: boolean;
}
