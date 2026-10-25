import type { Product, ProductDetail } from "@/lib/types/commerce";

/** Future Go adapters must preserve this contract, including integer minor-unit prices. */
export interface ProductService {
  getFeatured(): Promise<Product[]>;
  getFreshToday(): Promise<Product[]>;
  getBySlug(slug: string): Promise<ProductDetail | null>;
}
