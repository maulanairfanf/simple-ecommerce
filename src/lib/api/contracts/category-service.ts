import type { Category } from "@/lib/types/commerce";

export interface CategoryService {
  getAll(): Promise<Category[]>;
}
