import type Stripe from "stripe";
import { OrderService } from "./orderService";
import { HttpError } from "../middleware/errorHandler";

export class PaymentService {
  constructor(private readonly orders: OrderService) {}

  async handleStripeEvent(event: Stripe.Event) {
    switch (event.type) {
      case "checkout.session.completed":
        return this.onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      case "payment_intent.payment_failed":
        return this.onPaymentFailed(event.data.object as Stripe.PaymentIntent);
      default:
        return { received: true };
    }
  }

  private async onCheckoutCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      throw new HttpError(400, "Missing orderId in metadata");
    }
    const paymentIntentId = session.payment_intent as string;
    return this.orders.markPaid(orderId, paymentIntentId);
  }

  private async onPaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      return { skipped: true };
    }
    await this.orders.updateStatus({
      orderId,
      nextStatus: "cancelled",
      note: paymentIntent.last_payment_error?.message
    });
    return { cancelled: true };
  }
}
