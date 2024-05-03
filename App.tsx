import { StatusBar } from "./node_modules/expo-status-bar/src/StatusBar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRouter, Link } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
// import Hello from "./components/hello";
import WebSocketDemo from "./websocketDemo";
import ClosetStack from "./pages/closet";
import { MyHomeStack, HomeScreen, ProfileScreen } from "./pages/myHome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HistoryPage from "./pages/historyPage";
import store from "./redux/store";
import { Provider } from "react-redux";

export default function App() {
  // const router = useRouter();

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="HOME_STACK">
          <Tab.Screen
            name="HOME_STACK"
            component={MyHomeStack}
            options={{
              title: "Home",
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Closet"
            component={ClosetStack}
            options={{
              title: "Closet",
              headerShown: false,
            }}
          />
          {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
          <Tab.Screen
            name="History"
            component={HistoryPage}
            options={{
              title: "History",
              headerShown: false,
            }}
          />
          <Tab.Screen name="WebSocket" component={WebSocketDemo} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
    // <View style={styles.container}>
    // {/* <Button onPress={() => router.push('/pages/closet')} title="Open Page1" /> */}
    // <Link href="/pages/closet" asChild>
    //   <Button title="Open Page1" />
    // </Link>
    // {/* // <NavigationContainer>
    // //   <Stack.Navigator initialRouteName="Home">
    // //     <Stack.Screen name="Home" component={Test} />
    // //     <Stack.Screen name="One" component={One} />
    // //   </Stack.Navigator>
    // // </NavigationContainer> */}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
