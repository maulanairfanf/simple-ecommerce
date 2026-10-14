import type { AdminDashboardService } from "@/lib/api/contracts/admin-dashboard-service";
import { adminProducts } from "@/lib/api/adapters/mock/admin-data";

export const mockAdminDashboardService: AdminDashboardService = {
  async getDashboard() {
    return {
      activeProductCount: adminProducts.filter((product) => product.publicationStatus === "active")
        .length,
      lowStockProductCount: adminProducts.filter((product) => product.availability === "low_stock")
        .length,
      totalOrderCount: 0,
      pendingOrderCount: 0,
      recentOrders: [],
    };
  },
};
