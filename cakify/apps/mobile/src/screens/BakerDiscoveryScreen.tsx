import { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@mobile/services/api";
import { BakerCard } from "@mobile/components/BakerCard";
import { useCurrentLocation } from "@mobile/hooks/useCurrentLocation";
import { colors, spacing } from "@cakify/ui";
import { MAP_DEFAULTS } from "@cakify/config";

export const BakerDiscoveryScreen = () => {
  const navigation = useNavigation();
  const { coords } = useCurrentLocation();
  const [search, setSearch] = useState("");
  const { data: bakers = [] } = useQuery({ queryKey: ["bakers"], queryFn: Api.getBakers });

  const filtered = useMemo(
    () => bakers.filter((baker) => baker.businessName.toLowerCase().includes(search.toLowerCase())),
    [bakers, search]
  );

  const region: Region = coords
    ? {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
    : (MAP_DEFAULTS.initialRegion as Region);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Discover bakers near you</Text>
      <TextInput
        placeholder="Search bakers or specialties"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <MapView style={styles.map} region={region}>
        {filtered.map((baker) => (
          <Marker
            key={baker.id}
            coordinate={{ latitude: baker.location.latitude, longitude: baker.location.longitude }}
            title={baker.businessName}
            description={baker.specialties.join(", ")}
            onCalloutPress={() => navigation.navigate("BakerDetails" as never, { bakerId: baker.id } as never)}
          />
        ))}
      </MapView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BakerCard baker={item} onPress={() => navigation.navigate("BakerDetails" as never, { bakerId: item.id } as never)} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  },
  search: {
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border
  },
  map: {
    height: 220,
    marginHorizontal: spacing.lg,
    borderRadius: 24
  },
  list: {
    padding: spacing.lg
  }
});
