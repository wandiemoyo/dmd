export type Role = "customer" | "baker" | "admin" | "courier";

export type GeoLocation = {
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postalCode?: string;
};

export type Baker = {
  id: string;
  name: string;
  businessName: string;
  description: string;
  rating: number;
  deliveryRadiusKm: number;
  minLeadTimeHours: number;
  avatarUrl: string;
  heroImageUrl: string;
  location: GeoLocation;
  specialties: string[];
  isVerified: boolean;
};

export type Cake = {
  id: string;
  bakerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  photoUrl: string;
  prepTimeMinutes: number;
  tags: string[];
  isFeatured: boolean;
};

export type OrderStatus =
  | "pending_payment"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderItem = {
  id: string;
  orderId: string;
  cakeId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
};

export type Order = {
  id: string;
  customerId: string;
  bakerId: string;
  deliveryAddress: GeoLocation;
  scheduledTime: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type Rating = {
  id: string;
  orderId: string;
  bakerId: string;
  customerId: string;
  score: number;
  comment?: string;
  createdAt: string;
};

export type Promotion = {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  maxRedemptions?: number;
  expiresAt?: string;
  isActive: boolean;
};

export type WithdrawalRequest = {
  id: string;
  bakerId: string;
  amount: number;
  currency: string;
  destination: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  processedAt?: string;
};

export type OrderStatusEvent = {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
};

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: []
};

export type PaymentEvent = {
  provider: "stripe" | "paypal" | "square";
  type: string;
  payload: Record<string, unknown>;
};
