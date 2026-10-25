import type { ProductService } from "@/lib/api/contracts/product-service";
import { request } from "@/lib/api/adapters/http/http-client";
import type { Product, ProductCategory, ProductDetail } from "@/lib/types/commerce";

type ApiProductSummary = {
  id?: number | string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  categories?: Array<{ name: string; slug: string }>;
  price: number | { amount: number; currency: "USD" };
  availability?: Product["availability"];
  quantity?: number;
  image?: string | null;
  imageUrl?: string;
  tags?: string[];
};
type ProductListResponse = {
  status: number;
  data: ApiProductSummary[];
  message: string;
};
type ApiProductDetail = {
  id: number | string;
  name: string;
  slug: string;
  quantity: number;
  categories?: Array<{ name: string; slug: string }>;
  category?: string;
  price: number;
  description: string;
  sku: string;
  publication_status: "active" | "archived";
  image?: string | null;
  tags?: string[];
};
type ProductDetailResponse = { data: ApiProductDetail };

const productCategories: ProductCategory[] = [
  "pastries",
  "breads",
  "cakes",
  "sweets",
  "beverages",
  "gifts",
  "cookies",
];

function toProductCategory(value: string | undefined): ProductCategory {
  const slug = value?.toLowerCase();
  return productCategories.includes(slug as ProductCategory)
    ? (slug as ProductCategory)
    : "pastries";
}

function toProduct(product: ApiProductSummary): Product {
  const category = product.categories?.[0]?.slug ?? product.category;
  const quantity = product.quantity;
  const availability =
    product.availability ??
    (quantity === undefined ? "in_stock" : quantity === 0 ? "sold_out" : "in_stock");
  const price =
    typeof product.price === "number"
      ? { amount: product.price, currency: "IDR" as const }
      : product.price;

  return {
    id: String(product.id ?? product.slug),
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription ?? product.description ?? "Fresh from the counter.",
    price,
    category: toProductCategory(category),
    photoBrief: "Product photography will arrive from the API.",
    imageUrl: product.imageUrl ?? product.image ?? undefined,
    availability,
    tags: product.tags ?? [],
    palette: "cream",
  };
}

export const httpProductService: ProductService = {
  async getFeatured() {
    const response = await request<ProductListResponse>(
      "/products?sort=featured&page=1&pageSize=4",
    );
    return response.data.map(toProduct);
  },
  async getFreshToday() {
    const response = await request<ProductListResponse>("/products?sort=fresh&page=1&pageSize=4");
    return response.data.map(toProduct);
  },
  async getBySlug(slug): Promise<ProductDetail> {
    const response = await request<ProductDetailResponse>(`/products/${encodeURIComponent(slug)}`);
    const product = response.data;
    const category = product.categories?.[0];
    const quantity = Math.max(0, product.quantity);
    return {
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: category?.name ?? product.category ?? "Bakery",
      price: { amount: product.price, currency: "IDR" },
      sku: product.sku,
      quantity,
      availability: quantity === 0 ? "sold_out" : "in_stock",
      publicationStatus: product.publication_status,
      tags: product.tags ?? [],
      imageUrl: product.image ?? undefined,
    };
  },
};
