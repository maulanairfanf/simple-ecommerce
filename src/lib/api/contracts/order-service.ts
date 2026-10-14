import type { OrderStatus, PaymentStatus } from "@/lib/types/commerce";

export interface OrderService {
  createOrder(input: {
    cartId: string;
    idempotencyKey: string;
  }): Promise<{ id: string; status: OrderStatus; paymentStatus: PaymentStatus }>;
}
