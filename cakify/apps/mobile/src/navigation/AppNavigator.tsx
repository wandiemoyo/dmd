import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@mobile/contexts/AuthContext";
import { RootStackParamList, TabParamList } from "./types";
import { LoginScreen } from "@mobile/screens/LoginScreen";
import { SignupScreen } from "@mobile/screens/SignupScreen";
import { BakerDiscoveryScreen } from "@mobile/screens/BakerDiscoveryScreen";
import { BakerDetailScreen } from "@mobile/screens/BakerDetailScreen";
import { OrdersScreen } from "@mobile/screens/OrdersScreen";
import { ProfileScreen } from "@mobile/screens/ProfileScreen";
import { OrderCheckoutScreen } from "@mobile/screens/OrderCheckoutScreen";
import { OrderTrackingScreen } from "@mobile/screens/OrderTrackingScreen";
import { colors } from "@cakify/ui";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary
    }}
  >
    <Tab.Screen name="Discover" component={BakerDiscoveryScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: colors.background }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={Tabs} />
            <Stack.Screen name="BakerDetails" component={BakerDetailScreen} />
            <Stack.Screen name="Checkout" component={OrderCheckoutScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
