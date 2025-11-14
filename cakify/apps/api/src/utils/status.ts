import { ORDER_STATUS_TRANSITIONS, OrderStatus } from "@cakify/types";

export const canTransition = (current: OrderStatus, next: OrderStatus) =>
  ORDER_STATUS_TRANSITIONS[current]?.includes(next) ?? false;

export const assertTransition = (current: OrderStatus, next: OrderStatus) => {
  if (!canTransition(current, next)) {
    throw new Error(`Invalid status transition: ${current} -> ${next}`);
  }
};
