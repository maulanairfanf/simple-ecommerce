import type { CategoryService } from "@/lib/api/contracts/category-service";
import { request } from "@/lib/api/adapters/http/http-client";
import type { Category } from "@/lib/types/commerce";

type ApiCategory = {
  id: number | string;
  name: string;
  slug: Category["slug"];
};

type CategoryResponse = {
  items: ApiCategory[];
};

export const httpCategoryService: CategoryService = {
  async getAll() {
    const response = await request<CategoryResponse>("/categories");
    return response.items.map((category) => ({
      id: String(category.id),
      name: category.name,
      slug: category.slug,
      description: "Fresh from the counter.",
      photoBrief: "Category photography will arrive from the API.",
      palette: "cream",
    }));
  },
};
