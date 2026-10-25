import { request } from "@/lib/api/adapters/http/http-client";
import type { AdminProductService } from "@/lib/api/contracts/admin-product-service";
import { mockAdminProductService } from "@/lib/api/adapters/mock/admin-product-service";
import type { AdminProduct, ProductPublicationStatus } from "@/lib/types/admin";

type ApiProduct = {
  id: number | string;
  name: string;
  slug: string;
  quantity: number;
  categories?: Array<{ slug: string }>;
  price: number;
  description: string;
  sku: string;
  publication_status: string;
  image?: string | null;
  updated_at: string;
};

type ApiResponse = { status: number; data: ApiProduct[]; message: string };

function toPublicationStatus(value: string): ProductPublicationStatus {
  if (value === "active" || value === "archived" || value === "draft") return value;
  return "pending";
}

function toAdminProduct(product: ApiProduct): AdminProduct {
  const stockQuantity = Math.max(0, product.quantity);
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.categories?.[0]?.slug ?? "uncategorized",
    price: { amount: product.price, currency: "IDR" },
    sku: product.sku,
    stockQuantity,
    availability: stockQuantity === 0 ? "sold_out" : "in_stock",
    publicationStatus: toPublicationStatus(product.publication_status),
    tags: [],
    images: product.image
      ? [{ id: `${product.id}-image`, url: product.image, alt: product.name, position: 0 }]
      : [],
    updatedAt: product.updated_at,
  };
}

export const httpAdminProductService: AdminProductService = {
  ...mockAdminProductService,
  async list() {
    const response = await request<ApiResponse>("/product");
    const items = response.data.map(toAdminProduct);
    return {
      items,
      pagination: { page: 1, pageSize: items.length, total: items.length, totalPages: 1 },
    };
  },
};
