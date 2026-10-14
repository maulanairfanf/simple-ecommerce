export interface AdminInventoryService {
  adjust(input: { variantId: string; delta: number; reason: string }): Promise<void>;
}
