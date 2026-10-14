import { describe, expect, it } from "vitest";
import { mockAdminAuthService } from "@/lib/api/adapters/mock/admin-auth-service";
import { mockAdminCategoryService } from "@/lib/api/adapters/mock/admin-category-service";
import { mockAdminProductService } from "@/lib/api/adapters/mock/admin-product-service";
import { adminLoginSchema } from "@/features/admin/auth/login-schema";
import { productFormSchema } from "@/features/admin/products/product-schema";

describe("admin frontend mocks", () => {
  it("validates login input before the mock session is created", () => {
    expect(adminLoginSchema.safeParse({ email: "not-an-email", password: "short" }).success).toBe(
      false,
    );
    expect(
      adminLoginSchema.safeParse({ email: "admin@example.com", password: "eightchars" }).success,
    ).toBe(true);
  });

  it("creates a development-only session without a token field", async () => {
    const session = await mockAdminAuthService.login({
      email: "admin@example.com",
      password: "eightchars",
    });
    expect(session.admin.permissions).toContain("products:write");
    expect("accessToken" in session).toBe(false);
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

  it("blocks archival of a category that still has products", async () => {
    await expect(mockAdminCategoryService.archive("cat_pastries")).rejects.toThrow(
      "Move products before archiving",
    );
  });

  it("archives then restores an empty category", async () => {
    const category = await mockAdminCategoryService.create({
      name: "Test category",
      slug: `test-category-${Date.now()}`,
      description: "A category used to verify archive and unarchive behavior.",
      imageUrl: undefined,
      active: true,
    });
    await mockAdminCategoryService.archive(category.id);
    expect(
      (await mockAdminCategoryService.list()).find((item) => item.id === category.id)?.active,
    ).toBe(false);
    await mockAdminCategoryService.unarchive(category.id);
    expect(
      (await mockAdminCategoryService.list()).find((item) => item.id === category.id)?.active,
    ).toBe(true);
  });

  it("requires category status changes to use archive actions", async () => {
    const category = await mockAdminCategoryService.create({
      name: "Lifecycle category",
      slug: `lifecycle-category-${Date.now()}`,
      description: "A category used to verify lifecycle protections.",
      imageUrl: undefined,
      active: true,
    });
    await expect(
      mockAdminCategoryService.update(category.id, { ...category, active: false }),
    ).rejects.toThrow("archive or unarchive");
  });
});
