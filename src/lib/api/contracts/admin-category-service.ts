import type { AdminCategory, CategoryInput } from "@/lib/types/admin";

export interface AdminCategoryService {
  list(): Promise<AdminCategory[]>;
  create(input: CategoryInput): Promise<AdminCategory>;
  update(id: string, input: CategoryInput): Promise<AdminCategory>;
  archive(id: string): Promise<void>;
}
