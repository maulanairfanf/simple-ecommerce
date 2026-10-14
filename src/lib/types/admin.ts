import type { Availability, ProductCategory } from "@/lib/types/commerce";

export type AdminPermission =
  | "products:read"
  | "products:write"
  | "categories:write"
  | "inventory:adjust"
  | "orders:read"
  | "orders:fulfillment";
export type ProductPublicationStatus = "draft" | "active" | "archived";
export type AdminMoney = { amount: number; currency: "IDR" };

export type AdminSession = {
  admin: { id: string; name: string; email: string; permissions: AdminPermission[] };
  expiresAt: string;
};

export type AdminProductImage = { id: string; url: string; alt: string; position: number };

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price: AdminMoney;
  sku: string;
  stockQuantity: number;
  availability: Availability;
  publicationStatus: ProductPublicationStatus;
  tags: string[];
  images: AdminProductImage[];
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  active: boolean;
  productCount: number;
};

export type Pagination = { page: number; pageSize: number; total: number; totalPages: number };
export type ListResult<T> = { items: T[]; pagination: Pagination };

export type AdminDashboard = {
  activeProductCount: number;
  lowStockProductCount: number;
  totalOrderCount: number;
  pendingOrderCount: number;
  recentOrders: Array<{
    id: string;
    number: string;
    customer: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt: string;
  }>;
};

export type ProductInput = Omit<AdminProduct, "id" | "updatedAt">;
export type CategoryInput = Omit<AdminCategory, "id" | "productCount">;
