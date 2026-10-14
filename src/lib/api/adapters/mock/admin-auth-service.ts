import type { AdminAuthService } from "@/lib/api/contracts/admin-auth-service";

export const mockAdminAuthService: AdminAuthService = {
  async login({ email }) {
    return {
      admin: {
        id: "dev_admin",
        name: "Development Admin",
        email,
        permissions: [
          "products:read",
          "products:write",
          "categories:write",
          "inventory:adjust",
          "orders:read",
          "orders:fulfillment",
        ],
      },
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };
  },
  async logout() {},
  async getSession() {
    return null;
  },
};
