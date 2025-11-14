import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useCurrentLocation = () => {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status === Location.PermissionStatus.GRANTED) {
        const location = await Location.getCurrentPositionAsync({});
        setCoords(location.coords);
      }
    })();
  }, []);

  return { permissionStatus, coords };
};
