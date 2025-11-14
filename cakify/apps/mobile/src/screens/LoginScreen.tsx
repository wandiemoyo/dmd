import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, spacing, radius } from "@cakify/ui";
import { useAuth } from "@mobile/contexts/AuthContext";
import { RootStackParamList } from "@mobile/navigation/types";

export const LoginScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Login">) => {
  const { signInWithEmail, signInWithOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      Alert.alert("Login failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async () => {
    setLoading(true);
    try {
      await signInWithOtp(phone);
      Alert.alert("OTP sent", "Check your phone for the code");
    } catch (error) {
      Alert.alert("OTP error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Cakify</Text>
      <Text style={styles.subheading}>Login to discover nearby bakers</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={handleEmailLogin} disabled={loading}>
        <Text style={styles.primaryText}>{loading ? "Loading..." : "Login"}</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or phone OTP</Text>
        <View style={styles.line} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Phone (+254...)"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.secondaryButton} onPress={handleOtp} disabled={loading}>
        <Text style={styles.secondaryText}>Send OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}> 
        <Text style={styles.link}>New here? Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
    backgroundColor: colors.background
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm
  },
  subheading: {
    color: colors.muted,
    marginBottom: spacing.xl
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center"
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700"
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    color: colors.muted
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center"
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: "600"
  },
  link: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.secondary,
    fontWeight: "600"
  }
});
