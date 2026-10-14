import type { AdminDashboard } from "@/lib/types/admin";

export interface AdminDashboardService {
  getDashboard(): Promise<AdminDashboard>;
}
