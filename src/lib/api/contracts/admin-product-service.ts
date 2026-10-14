import type {
  AdminProduct,
  ListResult,
  ProductInput,
  ProductPublicationStatus,
} from "@/lib/types/admin";
import type { ProductCategory } from "@/lib/types/commerce";

export type AdminProductQuery = {
  q?: string;
  category?: ProductCategory;
  status?: ProductPublicationStatus;
  sort?: "updated" | "price-low" | "price-high";
  page?: number;
  pageSize?: number;
};

export interface AdminProductService {
  list(query?: AdminProductQuery): Promise<ListResult<AdminProduct>>;
  getById(id: string): Promise<AdminProduct | null>;
  create(input: ProductInput): Promise<AdminProduct>;
  update(id: string, input: ProductInput): Promise<AdminProduct>;
  archive(id: string): Promise<void>;
}
