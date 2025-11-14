import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RootStackParamList } from "@mobile/navigation/types";
import { Api } from "@mobile/services/api";
import { useOrderStore } from "@mobile/store/orderStore";
import { useAuth } from "@mobile/contexts/AuthContext";
import { colors, spacing, radius } from "@cakify/ui";

export const OrderCheckoutScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Checkout">>();
  const navigation = useNavigation();
  const { user, profile } = useAuth();
  const [address, setAddress] = useState("123 Cake St, Nairobi");
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [showPicker, setShowPicker] = useState(false);
  const setActiveOrder = useOrderStore((state) => state.setActiveOrder);
  const setLastOrder = useOrderStore((state) => state.setLastOrder);

  const { data: baker } = useQuery({ queryKey: ["baker", route.params.bakerId], queryFn: () => Api.getBaker(route.params.bakerId) });
  const cake = baker?.cakes?.find((item) => item.id === route.params.cakeId);

  const mutation = useMutation({
    mutationFn: () =>
      Api.createOrder({
        customerId: user?.id ?? "anon",
        bakerId: route.params.bakerId,
        currency: cake?.currency ?? "USD",
        paymentIntentId: undefined,
        scheduledTime: deliveryDate.toISOString(),
        deliveryAddress: {
          latitude: baker?.location.latitude ?? 0,
          longitude: baker?.location.longitude ?? 0,
          addressLine1: address,
          city: baker?.location.city ?? "",
          country: baker?.location.country ?? ""
        },
        items: [
          {
            cakeId: route.params.cakeId,
            quantity: 1,
            unitPrice: cake?.price ?? 0,
            notes
          }
        ]
      })
  });

  const placeOrder = async () => {
    if (!cake) return;
    try {
      const order = await mutation.mutateAsync();
      setActiveOrder(order.id);
      setLastOrder(order);
      Alert.alert("Order placed", "We'll notify you once the baker accepts.");
      navigation.navigate("OrderTracking" as never, { orderId: order.id } as never);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Checkout</Text>
      <Text style={styles.label}>Baker</Text>
      <Text style={styles.value}>{baker?.businessName}</Text>
      <Text style={styles.label}>Cake</Text>
      <Text style={styles.value}>{cake?.title}</Text>

      <Text style={styles.label}>Delivery address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Delivery time</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text>{deliveryDate.toLocaleString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={deliveryDate}
          mode="datetime"
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) setDeliveryDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Write delivery instructions or personalization"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={placeOrder} disabled={mutation.isPending}>
        <Text style={styles.primaryText}>{mutation.isPending ? "Placing..." : "Place order"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: spacing.lg
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: spacing.lg
  },
  label: {
    marginTop: spacing.md,
    color: colors.muted
  },
  value: {
    fontSize: 16,
    fontWeight: "600"
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm
  },
  primaryButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center"
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700"
  }
});
