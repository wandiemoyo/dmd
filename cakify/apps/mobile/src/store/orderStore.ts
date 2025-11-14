import { create } from "zustand";
import { Order } from "@cakify/types";

export type CartItem = {
  cakeId: string;
  title: string;
  quantity: number;
  price: number;
};

type OrderState = {
  cart: CartItem[];
  activeOrderId: string | null;
  lastOrder?: Order;
  addToCart: (item: CartItem) => void;
  updateQuantity: (cakeId: string, quantity: number) => void;
  clearCart: () => void;
  setActiveOrder: (orderId: string | null) => void;
  setLastOrder: (order: Order) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
  cart: [],
  activeOrderId: null,
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((cartItem) => cartItem.cakeId === item.cakeId);
      if (existing) {
        return {
          cart: state.cart.map((cartItem) =>
            cartItem.cakeId === item.cakeId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        };
      }
      return { cart: [...state.cart, item] };
    }),
  updateQuantity: (cakeId, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) => (item.cakeId === cakeId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    })),
  clearCart: () => set({ cart: [] }),
  setActiveOrder: (orderId) => set({ activeOrderId: orderId }),
  setLastOrder: (order) => set({ lastOrder: order })
}));
