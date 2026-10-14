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

  it("creates then archives a mock product", async () => {
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
  });

  it("blocks archival of a category that still has products", async () => {
    await expect(mockAdminCategoryService.archive("cat_pastries")).rejects.toThrow(
      "Move products before archiving",
    );
  });
});
