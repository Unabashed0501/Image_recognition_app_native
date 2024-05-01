import React, { useState } from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import { useRouter, Link } from "expo-router";
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const MyHomeStack = () => {
  // const router = useRouter();
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

type RootStackParamList = {
  Profile: { name: string };
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Profile">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Button
        title="Go to Oscar's profile"
        onPress={() => navigation.navigate("Profile", { name: "Oscar" })}
      />
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
