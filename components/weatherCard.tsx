import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import getReverseGeocodeAsync from "../api/apiReverseGeocode";
import fetchForecast from "../api/apiOpenForecast";
import fetchWeather from "../api/apiOpenWeather";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";

interface WeatherCardProps {
  location: string;
  temperature: number;
  weatherCondition: string;
  onPress: () => void;
}

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
const bgImage =
  "https://t4.ftcdn.net/jpg/03/00/94/69/360_F_300946931_kSR84OqudEhsmBZH47HU6ud7aZIDMjEx.jpg";

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  weatherCondition,
  onPress,
}) => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<WeatherForecast[]>();
  const [addressOfLocation, setAddressOfLocation] = useState<
    string | undefined
  >();
  //   const currentlocation = useLocation();

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
    if (
      !responseData ||
      !responseData.list ||
      !Array.isArray(responseData.list)
    ) {
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
    // console.log(location);
    const responseData = await fetchWeather(
      location.coords.latitude,
      location.coords.longitude
    );
    // console.log(JSON.stringify(data, null, 2));
    const data = parseWeatherData(responseData);
    // console.log(data);
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
    // console.log("forecast");
    // console.log(JSON.stringify(data, null, 2));
    // console.log("List: ", data);
    setForecast(data);
  };

  const handleAddress = async () => {
    try {
      const address = await getReverseGeocodeAsync(
        location!.coords.latitude,
        location!.coords.longitude
      );
      setAddressOfLocation(address);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  return (
    <View>
    {/* <ImageBackground source={{ uri: bgImage }} style={styles.container}> */}
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <LottieView
          source={
            weather?.weather[0].main === "Clouds" || "Rain"
              ? require("../assets/animation/cloudy.json")
              : require("../assets/animation/sunny.json")
          }
          style={{
            width: 200,
            aspectRatio: 1.5,
          }}
          loop
          autoPlay
        />
        <Text style={styles.location}>{addressOfLocation}</Text>
        <Text style={styles.temperature}>
          {Math.floor(weather?.main.temp as number)}°C
        </Text>
        <Text style={styles.weatherCondition}>{weather?.weather[0].main}</Text>
      </TouchableOpacity>
    {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    // backgroundImage: bgImage,
    padding: 10,
    borderRadius: 20,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 3,
  },
  location: {
    fontSize: 25,
    // fontWeight: "bold",
  },
  temperature: {
    fontSize: 35,
    // fontWeight: "bold",
    marginTop: 10,
  },
  weatherCondition: {
    fontSize: 20,
    marginTop: 10,
  },
});

export default WeatherCard;
