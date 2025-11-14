import { FC } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Baker } from "@cakify/types";
import { colors, spacing, radius } from "@cakify/ui";

type Props = {
  baker: Baker;
  onPress: () => void;
};

export const BakerCard: FC<Props> = ({ baker, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: baker.heroImageUrl }} style={styles.hero} />
    <View style={styles.content}>
      <Text style={styles.title}>{baker.businessName}</Text>
      <Text style={styles.subtitle}>{baker.description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>⭐ {baker.rating.toFixed(1)}</Text>
        <Text style={styles.meta}>{baker.specialties.slice(0, 2).join(" • ")}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border
  },
  hero: {
    width: "100%",
    height: 160
  },
  content: {
    padding: spacing.lg
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm
  },
  subtitle: {
    color: colors.muted,
    marginBottom: spacing.sm
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  meta: {
    fontWeight: "600",
    color: colors.text
  }
});
