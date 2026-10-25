import type { AdminCategoryService } from "@/lib/api/contracts/admin-category-service";
import { adminCategories } from "@/lib/api/adapters/mock/admin-data";

let nextCategoryId = 1;

export const mockAdminCategoryService: AdminCategoryService = {
  async list() {
    return adminCategories;
  },
  async create(input) {
    const now = new Date().toISOString();
    const category = {
      ...input,
      id: `cat_mock_${Date.now()}_${nextCategoryId++}`,
      createdAt: now,
      updatedAt: now,
    };
    adminCategories.push(category);
    return category;
  },
  async update(id, input) {
    const index = adminCategories.findIndex((category) => category.id === id);
    if (index < 0) throw new Error("Category not found");
    const category = {
      ...input,
      id,
      createdAt: adminCategories[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    adminCategories[index] = category;
    return category;
  },
  async delete(id) {
    const index = adminCategories.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Category not found");
    adminCategories.splice(index, 1);
  },
};
