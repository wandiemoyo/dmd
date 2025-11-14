import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, spacing, radius } from "@cakify/ui";
import { supabase } from "@mobile/services/supabase";
import { RootStackParamList } from "@mobile/navigation/types";

export const SignupScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Signup">) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
          data: {
            display_name: name,
            role: "customer"
          }
        }
      });
      if (error) throw error;
      Alert.alert("Success", "Confirm the email we just sent you");
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          display_name: name,
          role: "customer",
          phone_number: phone
        });
      }
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Signup failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create your account</Text>
      <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
        <Text style={styles.primaryText}>{loading ? "Creating..." : "Sign up"}</Text>
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
    fontSize: 26,
    fontWeight: "700",
    marginBottom: spacing.lg,
    color: colors.text
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
    alignItems: "center",
    marginTop: spacing.lg
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700"
  }
});
