import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { InMemoryOrderStore, OrderService } from "../src/services/orderService";
import { PaymentService } from "../src/services/paymentService";

const buildPaymentService = async () => {
  const orders = new OrderService(new InMemoryOrderStore());
  const order = await orders.createOrder({
    customerId: "customer-1",
    bakerId: "baker-1",
    scheduledTime: new Date(Date.now() + 3600 * 1000).toISOString(),
    deliveryAddress: {
      latitude: 0,
      longitude: 0,
      addressLine1: "Test",
      city: "Test",
      country: "KE"
    },
    currency: "USD",
    paymentIntentId: "pi_test",
    items: [
      {
        cakeId: "cake-test",
        quantity: 1,
        unitPrice: 20
      }
    ]
  });
  return { paymentService: new PaymentService(orders), orders, order };
};

describe("PaymentService", () => {
  it("moves order to accepted when checkout session completes", async () => {
    const { paymentService, orders, order } = await buildPaymentService();
    const session = {
      metadata: { orderId: order.id },
      payment_intent: "pi_test"
    } as Stripe.Checkout.Session;
    await paymentService.handleStripeEvent({
      type: "checkout.session.completed",
      data: { object: session }
    } as Stripe.Event);

    const updated = await orders.getOrder(order.id);
    expect(updated.status).toBe("accepted");
  });

  it("cancels order when payment fails", async () => {
    const { paymentService, orders, order } = await buildPaymentService();
    const paymentIntent = {
      metadata: { orderId: order.id },
      last_payment_error: { message: "Card declined" }
    } as Stripe.PaymentIntent;

    await paymentService.handleStripeEvent({
      type: "payment_intent.payment_failed",
      data: { object: paymentIntent }
    } as Stripe.Event);

    const updated = await orders.getOrder(order.id);
    expect(updated.status).toBe("cancelled");
  });
});
