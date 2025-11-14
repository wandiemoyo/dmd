import { v4 as uuid } from "uuid";
import { Order, OrderItem, OrderStatus } from "@cakify/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { assertTransition } from "../utils/status";
import { HttpError } from "../middleware/errorHandler";

export type CreateOrderInput = {
  customerId: string;
  bakerId: string;
  deliveryAddress: Order["deliveryAddress"];
  scheduledTime: string;
  items: Array<Pick<OrderItem, "cakeId" | "quantity" | "notes" | "unitPrice">>;
  currency: string;
  paymentIntentId?: string;
  promoCode?: string;
  metadata?: Record<string, string>;
};

export type StatusUpdateInput = {
  orderId: string;
  nextStatus: OrderStatus;
  note?: string;
};

export interface OrderStore {
  create(record: Order): Promise<Order>;
  get(orderId: string): Promise<Order | null>;
  listAll(): Promise<Order[]>;
  listByCustomer(customerId: string): Promise<Order[]>;
  listByBaker(bakerId: string): Promise<Order[]>;
  updateStatus(payload: { orderId: string; nextStatus: OrderStatus }): Promise<Order>;
  addStatusEvent(event: { orderId: string; status: OrderStatus; note?: string }): Promise<void>;
  upsertRating(event: {
    orderId: string;
    customerId: string;
    bakerId: string;
    score: number;
    comment?: string;
  }): Promise<void>;
}

export class OrderService {
  constructor(private readonly store: OrderStore) {}

  async createOrder(input: CreateOrderInput) {
    if (!input.items.length) {
      throw new HttpError(400, "Order must include at least one cake");
    }

    const totalAmount = input.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    const order: Order = {
      id: uuid(),
      customerId: input.customerId,
      bakerId: input.bakerId,
      deliveryAddress: input.deliveryAddress,
      scheduledTime: input.scheduledTime,
      totalAmount,
      currency: input.currency,
      status: "pending_payment",
      paymentIntentId: input.paymentIntentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: input.items.map((item) => ({
        id: uuid(),
        orderId: "",
        cakeId: item.cakeId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes
      }))
    };

    const persisted = await this.store.create(order);
    await this.store.addStatusEvent({ orderId: persisted.id, status: persisted.status });
    return persisted;
  }

  async getOrder(orderId: string) {
    const order = await this.store.get(orderId);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }
    return order;
  }

  async listCustomerOrders(customerId: string) {
    return this.store.listByCustomer(customerId);
  }

  async listBakerOrders(bakerId: string) {
    return this.store.listByBaker(bakerId);
  }

  async listAllOrders() {
    return this.store.listAll();
  }

  async updateStatus({ orderId, nextStatus, note }: StatusUpdateInput) {
    const order = await this.getOrder(orderId);
    assertTransition(order.status, nextStatus);
    const updated = await this.store.updateStatus({ orderId, nextStatus });
    await this.store.addStatusEvent({ orderId, status: nextStatus, note });
    return updated;
  }

  async markPaid(orderId: string, paymentIntentId: string) {
    const order = await this.getOrder(orderId);
    if (order.paymentIntentId && order.paymentIntentId !== paymentIntentId) {
      throw new HttpError(400, "Mismatched payment intent");
    }
    if (order.status !== "pending_payment") {
      return order;
    }
    const updated = await this.store.updateStatus({ orderId, nextStatus: "accepted" });
    await this.store.addStatusEvent({ orderId, status: "accepted", note: "Payment confirmed" });
    return updated;
  }

  async rateOrder(payload: { orderId: string; customerId: string; bakerId: string; score: number; comment?: string }) {
    if (payload.score < 1 || payload.score > 5) {
      throw new HttpError(400, "Score must be between 1 and 5");
    }
    await this.store.upsertRating(payload);
    return { success: true };
  }
}

export class InMemoryOrderStore implements OrderStore {
  private orders = new Map<string, Order>();
  private events: Array<{ orderId: string; status: OrderStatus; note?: string }> = [];

  async create(record: Order) {
    const items = record.items.map((item) => ({ ...item, orderId: record.id }));
    const order = { ...record, items };
    this.orders.set(order.id, order);
    return order;
  }

  async get(orderId: string) {
    return this.orders.get(orderId) ?? null;
  }

  async listByCustomer(customerId: string) {
    return [...this.orders.values()].filter((order) => order.customerId === customerId);
  }

  async listByBaker(bakerId: string) {
    return [...this.orders.values()].filter((order) => order.bakerId === bakerId);
  }

  async listAll() {
    return [...this.orders.values()];
  }

  async updateStatus({ orderId, nextStatus }: { orderId: string; nextStatus: OrderStatus }) {
    const order = await this.get(orderId);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }
    const updated: Order = { ...order, status: nextStatus, updatedAt: new Date().toISOString() };
    this.orders.set(orderId, updated);
    return updated;
  }

  async addStatusEvent(event: { orderId: string; status: OrderStatus; note?: string }) {
    this.events.push(event);
  }

  async upsertRating(_event: { orderId: string; customerId: string; bakerId: string; score: number; comment?: string }) {
    return;
  }
}

export class SupabaseOrderStore implements OrderStore {
  constructor(private readonly client: SupabaseClient) {}

  async create(record: Order) {
    const { items, ...orderFields } = record;
    const dbOrder = {
      id: orderFields.id,
      customer_id: orderFields.customerId,
      baker_id: orderFields.bakerId,
      delivery_address: orderFields.deliveryAddress,
      scheduled_time: orderFields.scheduledTime,
      total_amount: orderFields.totalAmount,
      currency: orderFields.currency,
      status: orderFields.status,
      payment_intent_id: orderFields.paymentIntentId,
      created_at: orderFields.createdAt,
      updated_at: orderFields.updatedAt
    };

    const { data, error } = await this.client
      .from("orders")
      .insert(dbOrder)
      .select("*, order_items(*)")
      .single();

    if (error) {
      throw new HttpError(500, error.message, error);
    }

    if (items.length) {
      const orderItems = items.map((item) => ({
        id: item.id,
        order_id: data.id,
        cake_id: item.cakeId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        notes: item.notes
      }));
      const { error: itemsError } = await this.client.from("order_items").insert(orderItems);
      if (itemsError) {
        throw new HttpError(500, itemsError.message, itemsError);
      }
    }

    return this.get(data.id) as Promise<Order>;
  }

  async get(orderId: string) {
    const { data, error } = await this.client
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new HttpError(500, error.message, error);
    }

    return mapOrder(data);
  }

  async listByCustomer(customerId: string) {
    const { data, error } = await this.client
      .from("orders")
      .select("*, order_items(*)")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new HttpError(500, error.message, error);
    }
    return data.map(mapOrder);
  }

  async listByBaker(bakerId: string) {
    const { data, error } = await this.client
      .from("orders")
      .select("*, order_items(*)")
      .eq("baker_id", bakerId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new HttpError(500, error.message, error);
    }
    return data.map(mapOrder);
  }

  async listAll() {
    const { data, error } = await this.client
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) {
      throw new HttpError(500, error.message, error);
    }
    return data.map(mapOrder);
  }

  async updateStatus({ orderId, nextStatus }: { orderId: string; nextStatus: OrderStatus }) {
    const { data, error } = await this.client
      .from("orders")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select("*, order_items(*)")
      .single();
    if (error) {
      throw new HttpError(500, error.message, error);
    }
    return mapOrder(data);
  }

  async addStatusEvent(event: { orderId: string; status: OrderStatus; note?: string }) {
    const { error } = await this.client.from("order_status_events").insert({
      id: uuid(),
      order_id: event.orderId,
      status: event.status,
      note: event.note
    });
    if (error) {
      throw new HttpError(500, error.message, error);
    }
  }

  async upsertRating(event: {
    orderId: string;
    customerId: string;
    bakerId: string;
    score: number;
    comment?: string;
  }) {
    const { error } = await this.client.from("ratings").upsert({
      id: uuid(),
      order_id: event.orderId,
      customer_id: event.customerId,
      baker_id: event.bakerId,
      score: event.score,
      comment: event.comment
    });
    if (error) {
      throw new HttpError(500, error.message, error);
    }
  }
}

const mapOrder = (row: any): Order => ({
  id: row.id,
  customerId: row.customer_id,
  bakerId: row.baker_id,
  deliveryAddress: row.delivery_address,
  scheduledTime: row.scheduled_time,
  totalAmount: row.total_amount,
  currency: row.currency,
  status: row.status,
  paymentIntentId: row.payment_intent_id ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  items: (row.order_items ?? []).map((item: any) => ({
    id: item.id,
    orderId: item.order_id,
    cakeId: item.cake_id,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    notes: item.notes ?? undefined
  }))
});
