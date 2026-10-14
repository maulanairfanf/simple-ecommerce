import type { Product } from "@/lib/types/commerce";

/** Future Go adapters must preserve this contract, including integer minor-unit prices. */
export interface ProductService {
  getFeatured(): Promise<Product[]>;
  getFreshToday(): Promise<Product[]>;
}
