import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import { FlatList } from "react-native-gesture-handler";
import ForecastItem from "./forecastItem";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";
import fetchWeather from "../api/apiOpenWeather";
import fetchForecast from "../api/apiOpenForecast";
import useLocation from "../geocoder/useLocation";
// import Geocoder from 'react-native-geocoding';
import getReverseGeocodeAsync from "../api/apiReverseGeocode";

const bgImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/1.jpg";

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  //   sea_level: number;
  //   grnd_level: number;
};

type Weather = {
  name: string;
  main: MainWeather;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];
  list?: WeatherForecast[];
};

export type WeatherForecast = {
  main: MainWeather;
  dt: number;
};

const WeatherScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<WeatherForecast[]>();
  const [addressOfLocation, setAddressOfLocation] = useState<string | undefined>();
  const currentlocation = useLocation();

  useEffect(() => {
    if (location) {
      handleWeather();
      handleForecast();
      handleAddress();
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const parseWeatherData = (responseData: any): Weather => {
    const mainWeather: MainWeather = {
      temp: responseData.main.temp / 10.0,
      feels_like: responseData.main.feels_like,
      temp_min: responseData.main.temp_min,
      temp_max: responseData.main.temp_max,
      pressure: responseData.main.pressure,
      humidity: responseData.main.humidity,
    };

    const weather: Weather = {
      name: responseData.name,
      main: mainWeather,
      weather: responseData.weather.map((item: any) => ({
        id: item.id,
        main: item.main,
        description: item.description,
        icon: item.icon,
      })),
    };

    return weather;
  };

  const parseForecastData = (responseData: any): WeatherForecast[] => {
    if (!responseData || !responseData.list || !Array.isArray(responseData.list)) {
      // Handle invalid or missing data
      return [];
    }
  
    return responseData.list.map((item: any) => ({
      dt: item.dt, // Unix timestamp of the forecasted time
      main: {
        temp: item.main.temp / 10.0,
        feels_like: item.main.feels_like,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
      },
      weather: item.weather.map((weatherItem: any) => ({
        id: weatherItem.id,
        main: weatherItem.main,
        description: weatherItem.description,
        icon: weatherItem.icon,
      })),
    }));
  };

  const handleWeather = async () => {
    if (!location) {
      return;
    }
    console.log(location);
    const responseData = await fetchWeather(
      location.coords.latitude,
      location.coords.longitude
    );
    // console.log(JSON.stringify(data, null, 2));
    const data = parseWeatherData(responseData);
    console.log(data);
    setWeather(data);
  };

  const handleForecast = async () => {
    // api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}
    if (!location) {
      return;
    }
    const responseData = await fetchForecast(
      location.coords.latitude,
      location.coords.longitude
    );
    // console.log(responseData)
    const data = parseForecastData(responseData);
    console.log("forecast");
    // console.log(JSON.stringify(data, null, 2));
    console.log("List: ", data);
    setForecast(data);
  };

  const handleAddress = async () => {
    try {
      const address = await getReverseGeocodeAsync(location!.coords.latitude, location!.coords.longitude);
      setAddressOfLocation(address);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  if (!weather) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.container}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* <Stack.Screen options={{ headerShown: false }} /> */}

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LottieView
          source={
            (weather.weather[0].main === "Clouds" || weather.weather[0].main === "Rain")
              ? require("../assets/animation/cloudy.json")
              : require("../assets/animation/sunny.json")
          }
          style={{
            width: 200,
            aspectRatio: 1,
          }}
          loop
          autoPlay
        />
        <Text style={styles.location}>{addressOfLocation}</Text>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
        <Text style={styles.location}>{weather.weather[0].main}</Text>
      </View>

      <FlatList
        data={forecast}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
          height: 150,
          marginBottom: 40,
          zIndex: 10
        }}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 10,
        }}
        renderItem={({ item }) => (
          <ForecastItem forecast={item as WeatherForecast} />
        )}
      />

      <StatusBar style="light" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  location: {
    // fontFamily: "Inter",
    fontSize: 30,
    color: "lightgray",
  },
  temp: {
    // fontFamily: "InterBlack",
    fontSize: 150,
    color: "#FEFEFE",
  },
  refreshButtonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});

export default WeatherScreen;
