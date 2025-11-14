import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  MAPS_PROVIDER: z.enum(["google", "mapbox"]).default("google"),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  MAPBOX_ACCESS_TOKEN: z.string().optional(),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().optional()
});

export const env = envSchema.parse({
  SUPABASE_URL:
    process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co",
  SUPABASE_ANON_KEY:
    process.env.SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  MAPS_PROVIDER: (process.env.MAPS_PROVIDER as "google" | "mapbox") ?? "google",
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
});

export const ORDER_STATUS_FLOW = [
  "pending_payment",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered"
] as const;

export type OrderStatus = (typeof ORDER_STATUS_FLOW)[number] | "cancelled" | "refunded";

export const PAYMENT_PROVIDERS = {
  stripe: {
    name: "Stripe",
    dashboardUrl: "https://dashboard.stripe.com",
    supportedCurrencies: ["USD", "EUR", "GBP", "KES"],
    supportedMethods: ["card", "wallet"]
  }
} as const;

export const MAP_DEFAULTS = {
  initialRegion: {
    latitude: -1.286389,
    longitude: 36.817223,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  },
  zoom: {
    min: 10,
    max: 18
  }
};

export const NOTIFICATION_CHANNELS = {
  orderUpdates: "order_updates",
  marketing: "marketing"
};
