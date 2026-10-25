export type Money = {
  amount: number;
  currency: "USD" | "IDR";
};

export type Availability = "in_stock" | "low_stock" | "sold_out";

export type ProductCategory =
  "pastries" | "breads" | "cakes" | "sweets" | "beverages" | "gifts" | "cookies";

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: Money;
  category: ProductCategory;
  photoBrief: string;
  imageUrl?: string;
  imageAlt?: string;
  palette: "butter" | "oat" | "jam" | "rose" | "sage" | "cream";
  availability: Availability;
  tags: string[];
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: { amount: number; currency: "IDR" };
  sku: string;
  quantity: number;
  availability: Availability;
  publicationStatus: "active" | "archived";
  tags: string[];
  imageUrl?: string;
};

export type Category = {
  id: string;
  slug: ProductCategory;
  name: string;
  description: string;
  photoBrief: string;
  palette: Product["palette"];
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
};

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";
export type PaymentStatus = "unpaid" | "payment_pending" | "paid" | "payment_failed" | "refunded";
