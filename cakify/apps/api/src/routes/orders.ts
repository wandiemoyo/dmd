import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { OrderService, SupabaseOrderStore } from "../services/orderService";

const router = Router();
const orderService = new OrderService(new SupabaseOrderStore(supabase));

const createOrderSchema = z.object({
  customerId: z.string(),
  bakerId: z.string(),
  deliveryAddress: z.object({
    latitude: z.number(),
    longitude: z.number(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    country: z.string(),
    postalCode: z.string().optional()
  }),
  scheduledTime: z.string(),
  currency: z.string().length(3),
  paymentIntentId: z.string().optional(),
  promoCode: z.string().optional(),
  items: z
    .array(
      z.object({
        cakeId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
        notes: z.string().optional()
      })
    )
    .min(1)
});

router.get("/", async (req, res, next) => {
  try {
    const { bakerId, customerId } = req.query as { bakerId?: string; customerId?: string };
    if (bakerId) {
      const orders = await orderService.listBakerOrders(bakerId);
      return res.json(orders);
    }
    if (customerId) {
      const orders = await orderService.listCustomerOrders(customerId);
      return res.json(orders);
    }
    const orders = await orderService.listAllOrders();
    return res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(payload);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/customer/:customerId", async (req, res, next) => {
  try {
    const orders = await orderService.listCustomerOrders(req.params.customerId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/baker/:bakerId", async (req, res, next) => {
  try {
    const orders = await orderService.listBakerOrders(req.params.bakerId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.enum(["accepted", "preparing", "out_for_delivery", "delivered", "cancelled", "refunded"]),
      note: z.string().optional()
    });
    const body = schema.parse(req.body);
    const order = await orderService.updateStatus({
      orderId: req.params.id,
      nextStatus: body.status,
      note: body.note
    });
    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/rating", async (req, res, next) => {
  try {
    const schema = z.object({
      customerId: z.string(),
      bakerId: z.string(),
      score: z.number().int().min(1).max(5),
      comment: z.string().optional()
    });
    const body = schema.parse(req.body);
    const result = await orderService.rateOrder({
      orderId: req.params.id,
      ...body
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
