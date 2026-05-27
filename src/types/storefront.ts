import type { Product } from "./products.js";

export interface Category {
  id: number;
  name: string;
  description: string;
  primary_image: string;
  images: string[];
  is_active: boolean;
  sort_order: number;
}

export interface CmsBlock {
  key: string;
  title: string;
  // HTML string
  content: string;
  meta: Record<string, string>;
}

export interface HomeCms {
  hero: CmsBlock;
  about: CmsBlock;
  // platform can introduce new CMS blocks without SDK changes
  [key: string]: CmsBlock;
}

export interface HomePage {
  categories: Category[];
  featured_products: Product[];
  latest_products: Product[];
  cms: HomeCms;
}
