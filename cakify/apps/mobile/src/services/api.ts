import { Baker, Cake, Order } from "@cakify/types";
import { seedBakers, seedCakes } from "@mobile/data/seed";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api";

type CreateOrderRequest = {
  customerId: string;
  bakerId: string;
  currency: string;
  paymentIntentId?: string;
  scheduledTime: string;
  deliveryAddress: BakeryLocation;
  items: Array<{
    cakeId: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }>;
};

type BakeryLocation = {
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postalCode?: string;
};

type ApiError = {
  message: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {})
      },
      ...options
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as ApiError;
      throw new Error(body.message || `API error ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn("API request failed", error);
    throw error;
  }
}

export const Api = {
  async getBakers(): Promise<Baker[]> {
    try {
      return await request<Baker[]>("/bakers");
    } catch {
      return seedBakers as Baker[];
    }
  },
  async getBaker(id: string): Promise<Baker & { cakes?: Cake[] }> {
    try {
      return await request<Baker & { cakes: Cake[] }>(`/bakers/${id}`);
    } catch {
      const baker = (seedBakers as Baker[]).find((b) => b.id === id);
      if (!baker) throw new Error("Baker not found");
      const bakerCakes = (seedCakes as Cake[]).filter((cake) => cake.bakerId === id);
      return { ...baker, cakes: bakerCakes } as Baker & { cakes: Cake[] };
    }
  },
  async getBakerCakes(id: string) {
    try {
      return await request<Cake[]>(`/bakers/${id}/cakes`);
    } catch {
      return (seedCakes as Cake[]).filter((cake) => cake.bakerId === id);
    }
  },
  async createOrder(payload: CreateOrderRequest) {
    return request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  async getOrder(orderId: string) {
    return request<Order>(`/orders/${orderId}`);
  },
  async getCustomerOrders(customerId: string) {
    return request<Order[]>(`/orders/customer/${customerId}`);
  },
  async updateOrderStatus(orderId: string, status: Order["status"]) {
    return request<Order>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  }
};
