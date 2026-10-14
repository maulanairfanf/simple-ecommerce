import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Name needs at least 2 characters."),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  description: z.string().min(12, "Description needs at least 12 characters."),
  category: z.enum(["pastries", "breads", "cakes", "sweets", "beverages", "gifts"]),
  priceAmount: z.number().int().nonnegative("Use a whole IDR amount."),
  sku: z.string().min(3, "SKU needs at least 3 characters."),
  stockQuantity: z.number().int().nonnegative("Stock cannot be negative."),
  availability: z.enum(["in_stock", "low_stock", "sold_out"]),
  publicationStatus: z.enum(["draft", "active", "archived"]),
  tags: z.string(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
