import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

function useLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (granted) {
        const lastKnownPosition = await Location.getLastKnownPositionAsync();
        if (!lastKnownPosition) {
          return;
        }
        const { latitude, longitude } = lastKnownPosition.coords;
        setLocation({ latitude, longitude });
      } else {
        Alert.alert("Location permission needed");
        // alert(alerts.location);
        return;
      }
    } catch (error: any) {
      Alert.alert("Error while getting location: " + error.message);
      //   alert("Error while getting location: " + error.message);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return location;
}

export default useLocation;
