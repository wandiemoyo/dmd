import { useEffect } from "react";
import { supabase } from "@mobile/services/supabase";
import { Order } from "@cakify/types";

export const useRealtimeOrder = (orderId: string | null, onUpdate: (order: Partial<Order>) => void) => {
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          onUpdate(payload.new as Partial<Order>);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, onUpdate]);
};
