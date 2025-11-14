import { useQuery } from "@tanstack/react-query";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "@mobile/navigation/types";
import { Api } from "@mobile/services/api";
import { colors, spacing, radius } from "@cakify/ui";

export const BakerDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "BakerDetails">>();
  const navigation = useNavigation();
  const { data, isLoading } = useQuery({ queryKey: ["baker", route.params.bakerId], queryFn: () => Api.getBaker(route.params.bakerId) });

  if (isLoading || !data) {
    return (
      <View style={styles.loader}> 
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: data.heroImageUrl }} style={styles.hero} />
        <View style={styles.header}>
          <Text style={styles.title}>{data.businessName}</Text>
          <Text style={styles.subtitle}>{data.description}</Text>
          <Text style={styles.meta}>⭐ {data.rating.toFixed(1)} · delivers within {data.deliveryRadiusKm} km</Text>
        </View>

        <Text style={styles.sectionLabel}>Signature cakes</Text>
        {data.cakes?.map((cake) => (
          <View key={cake.id} style={styles.cakeCard}>
            <Image source={{ uri: cake.photoUrl }} style={styles.cakeImage} />
            <View style={styles.cakeDetails}>
              <Text style={styles.cakeTitle}>{cake.title}</Text>
              <Text style={styles.cakeDescription}>{cake.description}</Text>
              <Text style={styles.price}>${cake.price.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("Checkout" as never, { bakerId: data.id, cakeId: cake.id } as never)}
              >
                <Text style={styles.primaryText}>Customize & order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  hero: {
    width: "100%",
    height: 220
  },
  header: {
    padding: spacing.lg
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text
  },
  subtitle: {
    color: colors.muted,
    marginVertical: spacing.sm
  },
  meta: {
    fontWeight: "600"
  },
  sectionLabel: {
    fontSize: 18,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    fontWeight: "700"
  },
  cakeCard: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  cakeImage: {
    width: 110,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg
  },
  cakeDetails: {
    flex: 1,
    padding: spacing.md
  },
  cakeTitle: {
    fontSize: 16,
    fontWeight: "700"
  },
  cakeDescription: {
    color: colors.muted,
    marginVertical: spacing.sm
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.sm
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center"
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700"
  }
});
