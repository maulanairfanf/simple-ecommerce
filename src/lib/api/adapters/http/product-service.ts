import type { ProductService } from "@/lib/api/contracts/product-service";
import { request } from "@/lib/api/adapters/http/http-client";
import type { Product } from "@/lib/types/commerce";

type ProductListResponse = { items: Product[] };

export const httpProductService: ProductService = {
  async getFeatured() {
    const response = await request<ProductListResponse>(
      "/products?sort=featured&page=1&pageSize=4",
    );
    return response.items;
  },
  async getFreshToday() {
    const response = await request<ProductListResponse>("/products?sort=fresh&page=1&pageSize=4");
    return response.items;
  },
};
