import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ORDER_STATUS_FLOW } from "@cakify/config";
import { OrderStatus } from "@cakify/types";
import { colors, spacing } from "@cakify/ui";

type Props = {
  currentStatus: OrderStatus;
};

export const OrderStatusTimeline: FC<Props> = ({ currentStatus }) => (
  <View style={styles.container}>
    {ORDER_STATUS_FLOW.map((status, index) => {
      const reached = ORDER_STATUS_FLOW.indexOf(currentStatus) >= index;
      return (
        <View key={status} style={styles.step}>
          <View style={[styles.circle, reached && styles.circleActive]} />
          <Text style={[styles.label, reached && styles.labelActive]}>{status.replace(/_/g, " ")}</Text>
          {index < ORDER_STATUS_FLOW.length - 1 && <View style={[styles.line, reached && styles.lineActive]} />}
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg
  },
  step: {
    flexDirection: "row",
    alignItems: "center"
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  label: {
    flex: 1,
    color: colors.muted,
    textTransform: "capitalize"
  },
  labelActive: {
    color: colors.text,
    fontWeight: "600"
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.sm
  },
  lineActive: {
    backgroundColor: colors.primary
  }
});
