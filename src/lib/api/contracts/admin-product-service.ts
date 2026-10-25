import type {
  AdminProduct,
  ListResult,
  ProductInput,
  ProductPublicationStatus,
} from "@/lib/types/admin";
import type { Availability } from "@/lib/types/commerce";

export type AdminProductQuery = {
  q?: string;
  category?: string;
  availability?: Availability;
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
  unarchive(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
