import { Alert } from "react-native";
// import dotenv from 'dotenv'
// dotenv.config({ path: '../backend/.env' })

// const appid = process.env.OPENWEATHER_API_KEY;
const appid = "4cc078ae2b1c62edfc8f849122161e4a";

async function fetchWeather(
  latitude: number,
  longitude: number,
) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    // console.log(data);

    return data;
  } catch (error) {
    Alert.alert(
      "Error",
      "Error while fetching weather data: " + (error as Error).message
    );
    return null;
  }
}

export default fetchWeather;
