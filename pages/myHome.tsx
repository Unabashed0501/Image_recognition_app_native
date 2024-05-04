import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Modal,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import useLocation from "../geocoder/useLocation";
import WeatherScreen from "../components/weather";
import WeatherCard from "../components/weatherCard";
import PressableButton from "../components/pressableButton";
import FavoriteItemsPage from "./favoriteItemsPage";
import UploadImagePage from "./uploadImage";
import BottomModal from "../components/BottomModal";
import useWebSocket, { ReadyState } from "react-native-use-websocket";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
  getEmbedding,
  getProcessedImage,
  queryEmbedding,
} from "../api/apiClient";

const MyHomeStack = () => {
  const Stack = createStackNavigator();
  const cureentlocation = useLocation();

  useEffect(
    () => console.log("current location", cureentlocation),
    [cureentlocation]
  );

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} cureentlocation={cureentlocation} />}
      </Stack.Screen>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Favorite" component={FavoriteItemsPage} />
      <Stack.Screen name="UploadImage" component={UploadImagePage} />
    </Stack.Navigator>
  );
};

type RootStackParamList = {
  Profile: { name: string };
  Weather: undefined;
  Favorite: undefined;
  UploadImage: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Profile">;
  cureentlocation: { latitude: number; longitude: number } | null;
};

const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  cureentlocation,
}) => {
  const [socketUrl, setSocketUrl] = useState("ws://10.10.3.110:81");
  const messageHistory = useRef<any[]>([]);
  const [base64Image, setBase64Image] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [queryData, setQueryData] = useState<any>(null);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("opened"),
      onClose: () => console.log("closed"),
      onMessage: async (message) => {
        console.log("Received msg: ", message.data);
        let trimmedStr: string = message.data.trim();
        if (trimmedStr.localeCompare("start streaming") === 0) {
          console.log("start streaming");
          await handleProcessedImage();
          sendMessage("detected");
        }
      },
      // Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    }
  );

  const handleProcessedImage = async () => {
    setIsModalVisible(true);
    const requestData = {
      // path: "http://10.10.2.100/cam-lo.jpg",
      // path: "https://wtfunk.tw/%E5%A4%A7%E5%B0%8F/P641%E7%B6%A0370.jpg",
      path: "https://www.next.us/nxtcms/resource/blob/5791586/ee0fc6a294be647924fa5f5e7e3df8e9/hoodies-data.jpg",
    };
    const imageBase64 = await getProcessedImage(requestData);
    console.log("get imageBase64:", imageBase64);
    const values = await getEmbedding(imageBase64);
    console.log("values: ", values);
    const data = await queryEmbedding(values, "default");
    console.log(data);
    setQueryData(data);
  };

  messageHistory.current = React.useMemo(
    () => messageHistory.current.concat(lastMessage),
    [lastMessage]
  );

  const handleClickSendMessage = React.useCallback(() => {
    sendMessage("start");
    console.log("sent Hello");
  }, []);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    bottomSheetRef.current?.close();
  };

  return (
    <SafeAreaView>
      <WeatherCard
        location="Your Location"
        temperature={25} 
        weatherCondition="Sunny"
        onPress={() => navigation.navigate("Weather")}
      />
      <View style={styles.spacing} />
      <PressableButton
        title="Go to Oscar's profile"
        onPress={() => navigation.navigate("Profile", { name: "Oscar" })}
      />
      <View style={styles.spacing} />
      {/* <PressableButton
        title="Fetch weather in your area"
        onPress={() => handleFetchWeather()}
      /> */}
      <PressableButton
        title="Today's OOTD"
        onPress={() => navigation.navigate("Favorite")}
      />
      <View style={styles.spacing} />
      <PressableButton
        title="Upload Image"
        onPress={() => navigation.navigate("UploadImage")}
      />
      {/* <Button
      title="Save Embeddings"
      onPress={() => handleSaveEmbeddings()}
    /> */}
      <Button title="Open Modal" onPress={() => setIsModalVisible(true)} />
      <Button title="Send Message" onPress={handleClickSendMessage} />
      {/* <GestureHandlerRootView>{BottomModal()}</GestureHandlerRootView> */}
      <Modal visible={isModalVisible} animationType="slide">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {queryData &&
            queryData.map((item: any, index: number) => (
              <Text key={index}>{item.title}</Text>
            ))}
          <Button title="Close Modal" onPress={handleCloseModal} />
        </View>
      </Modal>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spacing: {
    height: 30, // Adjust the height for desired spacing
  },
});

export { MyHomeStack, HomeScreen, ProfileScreen };
