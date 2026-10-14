import type { ProductService } from "@/lib/api/contracts/product-service";
import type { Product } from "@/lib/types/commerce";

export const pastryProducts: Product[] = [
  {
    id: "prd_butter_swirl",
    slug: "butter-swirl",
    name: "Butter Swirl",
    shortDescription: "A crisp, buttery morning spiral with just enough salt.",
    price: { amount: 650, currency: "USD" },
    category: "pastries",
    photoBrief:
      "Golden laminated pastry on a wrinkled cream paper bag, side-lit on a tiled counter.",
    palette: "butter",
    availability: "in_stock",
    tags: ["bestseller"],
  },
  {
    id: "prd_strawberry_window_tart",
    slug: "strawberry-window-tart",
    name: "Strawberry Window Tart",
    shortDescription: "A small almond tart with bright fruit and a jammy center.",
    price: { amount: 850, currency: "USD" },
    category: "sweets",
    photoBrief:
      "Strawberry tart on a chipped stoneware plate with a small fork and jam-red napkin.",
    palette: "jam",
    availability: "low_stock",
    tags: ["seasonal", "giftable"],
  },
  {
    id: "prd_corner_loaf",
    slug: "corner-loaf",
    name: "Corner Loaf",
    shortDescription: "A crackly country loaf for toast, soup, and tearing into at the table.",
    price: { amount: 900, currency: "USD" },
    category: "breads",
    photoBrief:
      "Rustic sourdough loaf on a worn wooden board with flour and a striped kitchen towel.",
    palette: "oat",
    availability: "in_stock",
    tags: ["daily bake"],
  },
  {
    id: "prd_apricot_sheet_cake",
    slug: "apricot-sheet-cake",
    name: "Apricot Sheet Cake",
    shortDescription: "A soft, shareable cake with baked stone fruit and a butter crumb.",
    price: { amount: 2800, currency: "USD" },
    category: "cakes",
    photoBrief: "Square slice of apricot cake in a paper pastry box with a serving spatula nearby.",
    palette: "rose",
    availability: "in_stock",
    tags: ["for sharing"],
  },
  {
    id: "prd_cocoa_shortbread",
    slug: "cocoa-shortbread",
    name: "Cocoa Shortbread",
    shortDescription: "Snappy little cocoa biscuits for the pocket of your afternoon.",
    price: { amount: 700, currency: "USD" },
    category: "sweets",
    photoBrief: "Stack of cocoa shortbread cookies in a striped paper sleeve beside a tea cup.",
    palette: "sage",
    availability: "in_stock",
    tags: ["bestseller"],
  },
];

export const mockProductService: ProductService = {
  async getFeatured(): Promise<Product[]> {
    return pastryProducts.slice(0, 4);
  },
  async getFreshToday(): Promise<Product[]> {
    return pastryProducts.slice(1, 5);
  },
};
