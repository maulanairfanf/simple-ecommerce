import type { CartItem } from "@/lib/types/commerce";

export interface CartService {
  getCart(): Promise<CartItem[]>;
  addItem(input: { variantId: string; quantity: number }): Promise<CartItem[]>;
  updateItem(itemId: string, quantity: number): Promise<CartItem[]>;
  removeItem(itemId: string): Promise<CartItem[]>;
}
