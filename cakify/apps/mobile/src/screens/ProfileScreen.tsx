import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@mobile/contexts/AuthContext";
import { colors, spacing, radius } from "@cakify/ui";
import { useState } from "react";

export const ProfileScreen = () => {
  const { user, profile, signOut } = useAuth();
  const [marketing, setMarketing] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    Alert.alert("Signed out");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{profile?.displayName ?? user?.email ?? "Guest"}</Text>
      <Text style={styles.subheading}>{user?.email}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Marketing updates</Text>
        <Switch value={marketing} onValueChange={setMarketing} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background
  },
  heading: {
    fontSize: 24,
    fontWeight: "800"
  },
  subheading: {
    color: colors.muted,
    marginBottom: spacing.lg
  },
  card: {
    backgroundColor: "#fff",
    padding: spacing.lg,
    borderRadius: radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  label: {
    fontWeight: "600"
  },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.danger,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  }
});
