import { Router } from "express";
import { env } from "@cakify/config";
import { stripe } from "../lib/stripe";
import { HttpError } from "../middleware/errorHandler";
import { PaymentService } from "../services/paymentService";
import { OrderService, SupabaseOrderStore } from "../services/orderService";
import { supabase } from "../lib/supabase";

const router = Router();
const paymentService = new PaymentService(new OrderService(new SupabaseOrderStore(supabase)));

router.post("/stripe", async (req, res, next) => {
    try {
      if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
        throw new HttpError(500, "Stripe is not configured");
      }

      const signature = req.headers["stripe-signature"] as string;
      if (!signature) {
        throw new HttpError(400, "Missing stripe-signature header");
      }

      const event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
      const result = await paymentService.handleStripeEvent(event);
      res.json({ received: true, result });
    } catch (error) {
      next(error);
    }
  });

export default router;
