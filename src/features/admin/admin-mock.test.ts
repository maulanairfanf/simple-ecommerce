import { describe, expect, it } from "vitest";
import { mockAdminAuthService } from "@/lib/api/adapters/mock/admin-auth-service";
import { mockAdminCategoryService } from "@/lib/api/adapters/mock/admin-category-service";
import { mockAdminProductService } from "@/lib/api/adapters/mock/admin-product-service";
import { adminLoginSchema } from "@/features/admin/auth/login-schema";
import { productFormSchema } from "@/features/admin/products/product-schema";

describe("admin frontend mocks", () => {
  it("validates login input before the mock session is created", () => {
    expect(adminLoginSchema.safeParse({ username: "", password: "short" }).success).toBe(false);
    expect(adminLoginSchema.safeParse({ username: "admin", password: "eightchars" }).success).toBe(
      true,
    );
  });

  it("creates a development-only session", async () => {
    const session = await mockAdminAuthService.login({
      username: "admin",
      password: "eightchars",
    });
    expect(session.admin.permissions).toContain("products:write");
    expect(session.token).toBe("mock-admin-token");
  });

  it("rejects invalid product form values", () => {
    expect(
      productFormSchema.safeParse({
        name: "",
        slug: "Bad slug",
        description: "short",
        category: "pastries",
        priceAmount: -1,
        sku: "",
        stockQuantity: -1,
        availability: "in_stock",
        publicationStatus: "draft",
        tags: "",
      }).success,
    ).toBe(false);
  });

  it("creates, archives, then restores a mock product as a draft", async () => {
    const product = await mockAdminProductService.create({
      name: "Test Bun",
      slug: `test-bun-${Date.now()}`,
      description: "A test product for the mock admin flow.",
      category: "pastries",
      price: { amount: 1000, currency: "IDR" },
      sku: `TEST-${Date.now()}`,
      stockQuantity: 1,
      availability: "in_stock",
      publicationStatus: "draft",
      tags: [],
      images: [],
    });
    await mockAdminProductService.archive(product.id);
    expect((await mockAdminProductService.getById(product.id))?.publicationStatus).toBe("archived");
    await expect(
      mockAdminProductService.update(product.id, { ...product, publicationStatus: "active" }),
    ).rejects.toThrow("archive or unarchive");
    await mockAdminProductService.unarchive(product.id);
    expect((await mockAdminProductService.getById(product.id))?.publicationStatus).toBe("draft");
  });

  it("updates a category status", async () => {
    const category = await mockAdminCategoryService.create({
      name: "Test category",
      slug: `test-category-${Date.now()}`,
      status: "active",
    });
    await mockAdminCategoryService.update(category.id, { ...category, status: "inactive" });
    expect(
      (await mockAdminCategoryService.list()).find((item) => item.id === category.id)?.status,
    ).toBe("inactive");
  });

  it("deletes a category", async () => {
    const category = await mockAdminCategoryService.create({
      name: "Delete category",
      slug: `delete-category-${Date.now()}`,
      status: "active",
    });
    await mockAdminCategoryService.delete(category.id);
    expect((await mockAdminCategoryService.list()).some((item) => item.id === category.id)).toBe(
      false,
    );
  });
});
