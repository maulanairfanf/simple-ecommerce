import type { AdminProductImage } from "@/lib/types/admin";

export interface AdminMediaService {
  upload(file: File): Promise<AdminProductImage>;
}
