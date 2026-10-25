import { request } from "@/lib/api/adapters/http/http-client";
import type { AdminCategoryService } from "@/lib/api/contracts/admin-category-service";
import type { AdminCategory, CategoryStatus } from "@/lib/types/admin";

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  status: CategoryStatus;
  created_at: string;
  updated_at: string;
};

type ApiResponse<T> = { status: number; data: T; message: string };

function toAdminCategory(category: ApiCategory): AdminCategory {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    status: category.status,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  };
}

export const httpAdminCategoryService: AdminCategoryService = {
  async list() {
    const response = await request<ApiResponse<ApiCategory[]>>("/category?sort=name&order=desc");
    return response.data.map(toAdminCategory);
  },
  async create(input) {
    const response = await request<ApiResponse<ApiCategory>>("/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return toAdminCategory(response.data);
  },
  async update(id, input) {
    const response = await request<ApiResponse<ApiCategory>>(
      `/category/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );
    return toAdminCategory(response.data);
  },
  async delete(id) {
    await request<ApiResponse<null>>(`/category/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
