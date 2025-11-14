import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "@mobile/navigation/types";
import { Api } from "@mobile/services/api";
import { OrderStatusTimeline } from "@mobile/components/OrderStatusTimeline";
import { useRealtimeOrder } from "@mobile/hooks/useRealtimeOrder";
import { colors, spacing } from "@cakify/ui";

export const OrderTrackingScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "OrderTracking">>();
  const { data: order, refetch } = useQuery({ queryKey: ["order", route.params.orderId], queryFn: () => Api.getOrder(route.params.orderId) });
  const [status, setStatus] = useState(order?.status ?? "pending_payment");

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
  }, [order?.status]);

  const handleRealtime = useCallback(
    (payload: Partial<{ status: string }>) => {
      if (payload.status) {
        setStatus(payload.status as typeof status);
        refetch();
      }
    },
    [refetch]
  );

  useRealtimeOrder(route.params.orderId, handleRealtime);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading order...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Order tracking</Text>
      <Text style={styles.meta}>Order #{order.id.slice(0, 6)}</Text>
      <Text style={styles.meta}>Baker · {order.bakerId}</Text>

      <OrderStatusTimeline currentStatus={status as typeof order.status} />

      <View style={styles.card}>
        <Text style={styles.label}>Delivery address</Text>
        <Text>{order.deliveryAddress.addressLine1}</Text>
        <Text>
          {order.deliveryAddress.city}, {order.deliveryAddress.country}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: spacing.sm
  },
  meta: {
    color: colors.muted
  },
  card: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  label: {
    fontWeight: "600",
    marginBottom: spacing.xs
  }
});
