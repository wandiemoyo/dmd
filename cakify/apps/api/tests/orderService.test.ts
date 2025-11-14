import { describe, expect, it } from "vitest";
import { InMemoryOrderStore, OrderService } from "../src/services/orderService";

const buildService = () => new OrderService(new InMemoryOrderStore());

const baseOrderPayload = {
  customerId: "customer-1",
  bakerId: "baker-1",
  scheduledTime: new Date(Date.now() + 3600 * 1000).toISOString(),
  deliveryAddress: {
    latitude: -1.3,
    longitude: 36.8,
    addressLine1: "123 Cake Street",
    city: "Nairobi",
    country: "KE"
  },
  currency: "USD",
  items: [
    {
      cakeId: "cake-1",
      quantity: 1,
      unitPrice: 45
    }
  ]
};

describe("OrderService", () => {
  it("creates an order and defaults to pending_payment", async () => {
    const service = buildService();
    const order = await service.createOrder(baseOrderPayload);
    expect(order.status).toBe("pending_payment");
    expect(order.items).toHaveLength(1);
  });

  it("enforces status transitions", async () => {
    const service = buildService();
    const order = await service.createOrder(baseOrderPayload);
    const accepted = await service.updateStatus({ orderId: order.id, nextStatus: "accepted" });
    expect(accepted.status).toBe("accepted");

    await expect(
      service.updateStatus({ orderId: order.id, nextStatus: "delivered" })
    ).rejects.toThrowError(/Invalid status transition/);
  });

  it("marks an order as paid via payment intent", async () => {
    const service = buildService();
    const order = await service.createOrder({ ...baseOrderPayload, paymentIntentId: "pi_123" });
    const updated = await service.markPaid(order.id, "pi_123");
    expect(updated.status).toBe("accepted");
  });
});
