import type { Availability } from "@/lib/types/commerce";

export type AdminPermission =
  | "products:read"
  | "products:write"
  | "categories:write"
  | "inventory:adjust"
  | "orders:read"
  | "orders:fulfillment";
export type ProductPublicationStatus = "pending" | "draft" | "active" | "archived";
export type CategoryStatus = "active" | "inactive";
export type AdminMoney = { amount: number; currency: "IDR" };

export type AdminSession = {
  token: string;
  admin: { id: string; name: string; username: string; permissions: AdminPermission[] };
  expiresAt: string;
};

export type AdminProductImage = { id: string; url: string; alt: string; position: number };

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
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
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
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
export type CategoryInput = Pick<AdminCategory, "name" | "slug" | "status">;
