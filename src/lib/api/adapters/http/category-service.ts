import type { CategoryService } from "@/lib/api/contracts/category-service";
import { request } from "@/lib/api/adapters/http/http-client";
import type { Category } from "@/lib/types/commerce";

export const httpCategoryService: CategoryService = {
  async getAll() {
    const response = await request<{ items: Category[] }>("/categories");
    return response.items;
  },
};
