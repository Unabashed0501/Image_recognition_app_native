import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
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
import EditableProfilePage from "./profilePage";
import { useNavigation } from "expo-router";

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
      <Stack.Screen name="Profile" component={EditableProfilePage} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Favorite" component={FavoriteItemsPage} />
      <Stack.Screen name="UploadImage" component={UploadImagePage} />
    </Stack.Navigator>
  );
};

type RootStackParamList = {
  Home: undefined;
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
  const [selectedData, setSelectedData] = useState<any>(null);
  const [imageName, setImageName] = useState<any>("");
  // const navigationpop = useNavigation();

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
        // if (trimmedStr.localeCompare("start streaming2") === 0) {
        //   console.log("start streaming2");

        // }

        // setTimeout(() => {
        handleDisplayImage(message.data.trim());
        // delay(3000);
        sendMessage("detected");
        console.log("sent detected");
        // }, 5000);
      },
      // Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    }
  );
  const handleDisplayImage = (msg: string) => {
    console.log("msg: ", msg);
    setIsModalVisible(true);
    console.log("delay");
    if (msg === "1") {
      setImageName("1");
    }
    if (msg === "2") {
      setImageName("2");
    }
    if (msg === "3") {
      setImageName("3");
    }
  };

  const handleProcessedImage = async () => {
    setIsModalVisible(true);
    const requestData = {
      // path: "http://10.10.2.100:80/cam-lo.jpg",
      // path: "https://wtfunk.tw/%E5%A4%A7%E5%B0%8F/P641%E7%B6%A0370.jpg",
      path: "https://www.next.us/nxtcms/resource/blob/5791586/ee0fc6a294be647924fa5f5e7e3df8e9/hoodies-data.jpg",
      // path: "http://10.10.3.110/cam-lo.jpg",
    };
    // const imageBase64 = await getProcessedImage(requestData);
    const imageBase64 = await imageUrlToBase64(requestData.path);
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

  async function imageUrlToBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert the image to Base64.'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        throw new Error('Failed to fetch the image: ' + error);
    }
  }

  const handleClickSendMessage = React.useCallback(() => {
    sendMessage("start");
    console.log("sent Hello");
  }, []);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    bottomSheetRef.current?.close();
  };

  const handleSelectItem = (item: any) => {
    console.log("Selected item: ", item);
    setSelectedData(item);
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
      {/* <Button title="Open Modal" onPress={() => setIsModalVisible(true)} /> */}
      {/* <Button title="Send Message" onPress={handleClickSendMessage} /> */}
      <Button title="Display" onPress={() => handleDisplayImage("1")} />
      <Button title="Process Image" onPress={() => handleProcessedImage()} />
      {/* <GestureHandlerRootView>{BottomModal()}</GestureHandlerRootView> */}
      <Modal
        style={styles.modalContainer}
        visible={isModalVisible}
        animationType="slide"
      >
        {imageName === "1" ? (
          <View style={styles.itemContainer}>
            <Image
              source={require("../shirts/white_shirt/result.jpg")}
              style={styles.image}
            />
            <Text style={styles.itemText}>I AM GENIUS</Text>
            <Text style={styles.itemText}># 1</Text>
            <Button title="Select" onPress={() => setIsModalVisible(false)} />
          </View>
        ) : imageName === "2" ? (
          <View style={styles.itemContainer}>
            <Image
              source={require("../shirts/pants.png")}
              style={styles.image}
            />
            <Text style={styles.itemText}>Blue Pants</Text>
            <Text style={styles.itemText}># 4</Text>
            <Button title="Select" onPress={() => setIsModalVisible(false)} />
          </View>
        ) : (
          <View style={styles.itemContainer}>
            <Image
              source={require("../shirts/black.png")}
              style={styles.image}
            />
            <Text style={styles.itemText}>MakeNTU T-Shirt</Text>
            <Text style={styles.itemText}># 2</Text>
            <Button title="Select" onPress={() => setIsModalVisible(false)} />
          </View>
        )}
        {/* </ScrollView> */}
      </Modal>
      {queryData && (
        <View style={styles.selectedItemContainer}>
          <Text style={styles.selectedItemText}>
            Selected Item: {selectedData}
          </Text>
        </View>
      )}

      {/* <Button title="Close Modal" onPress={handleCloseModal} /> */}
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
  image: {
    width: 200,
    height: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 150,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  selectedItemContainer: {
    marginVertical: 20,
  },
  selectedItemText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export { MyHomeStack, HomeScreen, ProfileScreen };
function delay(arg0: number) {
  throw new Error("Function not implemented.");
}
