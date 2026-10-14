import { mockProductService } from "@/lib/api/adapters/mock/product-service";
import { mockCategoryService } from "@/lib/api/adapters/mock/category-service";
import { httpProductService } from "@/lib/api/adapters/http/product-service";
import { httpCategoryService } from "@/lib/api/adapters/http/category-service";
import { mockAdminAuthService } from "@/lib/api/adapters/mock/admin-auth-service";
import { mockAdminDashboardService } from "@/lib/api/adapters/mock/admin-dashboard-service";
import { mockAdminProductService } from "@/lib/api/adapters/mock/admin-product-service";
import { mockAdminCategoryService } from "@/lib/api/adapters/mock/admin-category-service";
import { mockAdminMediaService } from "@/lib/api/adapters/mock/admin-media-service";

const useHttpAdapter = process.env.NEXT_PUBLIC_API_ADAPTER === "http";

// Local development defaults to fixtures. Set NEXT_PUBLIC_API_ADAPTER=http when
// a Go API matching API_CONTRACT.md is available.
export const services = {
  products: useHttpAdapter ? httpProductService : mockProductService,
  categories: useHttpAdapter ? httpCategoryService : mockCategoryService,
  admin: {
    auth: mockAdminAuthService,
    dashboard: mockAdminDashboardService,
    products: mockAdminProductService,
    categories: mockAdminCategoryService,
    media: mockAdminMediaService,
  },
};
