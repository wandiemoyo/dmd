import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";
import { colors, spacing, radius, shadows, typography } from "./theme";

export const Card: React.FC<ViewProps & { title?: string; subtitle?: string }> = ({
  children,
  style,
  title,
  subtitle,
  ...rest
}) => (
  <View style={[styles.card, style]} {...rest}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    {children}
  </View>
);

export const StatusPill: React.FC<{ label: string; tone?: "info" | "success" | "warning" | "danger" }> = ({
  label,
  tone = "info"
}) => (
  <View style={[styles.pill, toneStyles[tone]]}>
    <Text style={styles.pillText}>{label}</Text>
  </View>
);

export const SectionTitle: React.FC<{ label: string; action?: React.ReactNode }> = ({ label, action }) => (
  <View style={styles.sectionTitleRow}>
    <Text style={styles.sectionTitle}>{label}</Text>
    {action}
  </View>
);

const toneStyles = StyleSheet.create({
  info: {
    backgroundColor: colors.secondary
  },
  success: {
    backgroundColor: colors.success
  },
  warning: {
    backgroundColor: colors.warning
  },
  danger: {
    backgroundColor: colors.danger
  }
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card
  },
  cardTitle: {
    fontSize: typography.subtitle,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm
  },
  cardSubtitle: {
    fontSize: typography.caption,
    color: colors.muted,
    marginBottom: spacing.md
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md
  },
  pillText: {
    color: colors.surface,
    fontWeight: "600"
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  sectionTitle: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.text
  }
});
