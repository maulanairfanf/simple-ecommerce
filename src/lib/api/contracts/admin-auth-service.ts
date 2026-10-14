import type { AdminSession } from "@/lib/types/admin";

export interface AdminAuthService {
  login(input: { email: string; password: string }): Promise<AdminSession>;
  logout(): Promise<void>;
  getSession(): Promise<AdminSession | null>;
}
