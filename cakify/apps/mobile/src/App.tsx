import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryProvider } from "@mobile/providers/QueryProvider";
import { AuthProvider } from "@mobile/contexts/AuthContext";
import { AppNavigator } from "@mobile/navigation/AppNavigator";
import { registerForPushNotifications } from "@mobile/services/notifications";
import { useEffect } from "react";

const RootApp = () => {
  useEffect(() => {
    registerForPushNotifications().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
};

export default RootApp;
