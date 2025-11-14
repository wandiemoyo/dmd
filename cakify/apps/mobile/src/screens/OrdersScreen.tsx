import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Api } from "@mobile/services/api";
import { useAuth } from "@mobile/contexts/AuthContext";
import { colors, spacing, radius } from "@cakify/ui";

export const OrdersScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { data = [], isRefetching, refetch } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => Api.getCustomerOrders(user?.id ?? "anon"),
    enabled: Boolean(user)
  });

  return (
    <FlatList
      style={styles.list}
      data={data}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={<Text style={styles.empty}>No orders yet</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderTracking" as never, { orderId: item.id } as never)}
          style={styles.card}
        >
          <Text style={styles.title}>{item.items[0]?.cakeId}</Text>
          <Text style={styles.subtitle}>{new Date(item.createdAt).toLocaleString()}</Text>
          <Text style={styles.chip}>{item.status.replace(/_/g, " ")}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg
  },
  card: {
    backgroundColor: "#fff",
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    fontSize: 16,
    fontWeight: "700"
  },
  subtitle: {
    color: colors.muted,
    marginVertical: spacing.xs
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    color: "#fff",
    fontWeight: "600"
  },
  empty: {
    textAlign: "center",
    marginTop: spacing.xl,
    color: colors.muted
  }
});
