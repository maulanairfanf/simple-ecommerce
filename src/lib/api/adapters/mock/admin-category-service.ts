import type { AdminCategoryService } from "@/lib/api/contracts/admin-category-service";
import { adminCategories } from "@/lib/api/adapters/mock/admin-data";

export const mockAdminCategoryService: AdminCategoryService = {
  async list() {
    return adminCategories;
  },
  async create(input) {
    const category = { ...input, id: `cat_mock_${Date.now()}`, productCount: 0 };
    adminCategories.push(category);
    return category;
  },
  async update(id, input) {
    const index = adminCategories.findIndex((category) => category.id === id);
    if (index < 0) throw new Error("Category not found");
    if (input.active !== adminCategories[index].active) {
      throw new Error("Use the archive or unarchive action to change category status");
    }
    const category = { ...input, id, productCount: adminCategories[index].productCount };
    adminCategories[index] = category;
    return category;
  },
  async archive(id) {
    const category = adminCategories.find((item) => item.id === id);
    if (!category) throw new Error("Category not found");
    if (category.productCount) throw new Error("Move products before archiving this category");
    category.active = false;
  },
  async unarchive(id) {
    const category = adminCategories.find((item) => item.id === id);
    if (!category) throw new Error("Category not found");
    category.active = true;
  },
};
