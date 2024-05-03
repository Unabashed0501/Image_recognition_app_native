import React, { useEffect, useState } from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import useLocation from "../geocoder/useLocation";
import fetchWeather from "../api/apiOpenWeather";
import WeatherScreen from "../components/weather";

const MyHomeStack = () => {
  const Stack = createStackNavigator();
  const cureentlocation = useLocation();

  useEffect(
    () => console.log("current location", cureentlocation),
    [cureentlocation]
  );

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
    </Stack.Navigator>
  );
};

type RootStackParamList = {
  Profile: { name: string };
  Weather: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Profile">;
  cureentlocation: { latitude: number; longitude: number } | null;
};

const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  cureentlocation,
}) => {
  const handleFetchWeather = async () => {
    const latitude = cureentlocation?.latitude;
    const longitude = cureentlocation?.longitude;
    if (latitude !== undefined && longitude !== undefined) {
      console.log("Fetching weather");
      const responseData = await fetchWeather(latitude, longitude);
      console.log(responseData);
    } else {
      console.log("Location not available");
    }
  };

  return (
    <SafeAreaView>
      <Button
        title="Go to Oscar's profile"
        onPress={() => navigation.navigate("Profile", { name: "Oscar" })}
      />
      <Button
        title="Fetch weather in your area"
        onPress={() => handleFetchWeather()}
      />
      <Button
        title="View Weather"
        onPress={() => navigation.navigate("Weather")} // Navigate to the Weather page
      />
      {/* <Button
      title="Save Embeddings"
      onPress={() => handleSaveEmbeddings()}
    /> */}
    </SafeAreaView>
  );
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Profile">;
  route: ProfileScreenRouteProp;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route }) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

export { MyHomeStack, HomeScreen, ProfileScreen };
