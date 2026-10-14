export interface InventoryService {
  updateVariantStock(variantId: string, quantity: number): Promise<void>;
}
