import { request } from "@/lib/api/adapters/http/http-client";
import type {
  AdminProductQuery,
  AdminProductService,
} from "@/lib/api/contracts/admin-product-service";
import { mockAdminProductService } from "@/lib/api/adapters/mock/admin-product-service";
import {
  PRODUCT_PUBLICATION_STATUS,
  type AdminProduct,
  type ProductInput,
  type ProductPublicationStatus,
} from "@/lib/types/admin";

type ApiProduct = {
  id: number | string;
  name: string;
  slug: string;
  quantity: number;
  categories?: Array<{ id: number | string; slug: string }>;
  price: number;
  description: string;
  sku: string;
  publication_status: string;
  image?: string | null;
  updated_at: string;
};

type ApiResponse<T> = { status: number; data: T; message: string };

function toPublicationStatus(value: string): ProductPublicationStatus {
  return value === PRODUCT_PUBLICATION_STATUS.ARCHIVED
    ? PRODUCT_PUBLICATION_STATUS.ARCHIVED
    : PRODUCT_PUBLICATION_STATUS.ACTIVE;
}

function toAdminProduct(product: ApiProduct): AdminProduct {
  const stockQuantity = Math.max(0, product.quantity);
  const category = product.categories?.[0];
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: category?.slug ?? "uncategorized",
    categoryId: category ? String(category.id) : undefined,
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

function toFormData(input: ProductInput): FormData {
  const formData = new FormData();
  formData.set("name", input.name);
  formData.set("slug", input.slug);
  formData.set("quantity", String(input.stockQuantity));
  formData.set("price", String(input.price.amount));
  formData.set("description", input.description);
  formData.set("sku", input.sku);
  formData.set("publication_status", input.publicationStatus);
  for (const tag of input.tags) formData.append("tags", tag);
  formData.append("categories", input.categoryId ?? input.category);
  if (input.imageFile) formData.set("image", input.imageFile);
  return formData;
}

export const httpAdminProductService: AdminProductService = {
  ...mockAdminProductService,
  async list(query: AdminProductQuery = {}) {
    const response = await request<ApiResponse<ApiProduct[]>>("/admin/products");
    const filtered = response.data
      .map(toAdminProduct)
      .filter((product) => {
        const queryText = `${product.name} ${product.sku}`.toLowerCase();
        return (
          (!query.q || queryText.includes(query.q.toLowerCase())) &&
          (!query.category || product.category === query.category) &&
          (!query.availability || product.availability === query.availability) &&
          (!query.status || product.publicationStatus === query.status)
        );
      })
      .toSorted((left, right) =>
        query.sort === "price-low"
          ? left.price.amount - right.price.amount
          : query.sort === "price-high"
            ? right.price.amount - left.price.amount
            : right.updatedAt.localeCompare(left.updatedAt),
      );
    const pageSize = (query.pageSize ?? filtered.length) || 1;
    const page = query.page ?? 1;
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      },
    };
  },
  async getById(id) {
    const response = await request<ApiResponse<ApiProduct>>(
      `/admin/products/${encodeURIComponent(id)}`,
    );
    return toAdminProduct(response.data);
  },
  async create(input) {
    const response = await request<ApiResponse<ApiProduct>>("/admin/products", {
      method: "POST",
      body: toFormData(input),
    });
    return toAdminProduct(response.data);
  },
  async update(id, input) {
    const response = await request<ApiResponse<ApiProduct>>(
      `/admin/products/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: toFormData(input),
      },
    );
    return toAdminProduct(response.data);
  },
  async archive(id) {
    await request(`/admin/products/${encodeURIComponent(id)}/publication_status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publication_status: PRODUCT_PUBLICATION_STATUS.ARCHIVED }),
    });
  },
  async unarchive(id) {
    await request(`/admin/products/${encodeURIComponent(id)}/publication_status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publication_status: PRODUCT_PUBLICATION_STATUS.ACTIVE }),
    });
  },
  async delete(id) {
    await request(`/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
