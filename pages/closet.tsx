import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import useWebSocket, { ReadyState } from "react-native-use-websocket";
import { SafeAreaView } from "react-native-safe-area-context";
import Catagory from "../components/catagory";
import MyClothesCard from "../components/myClothesCard";
import Header from "../components/header";
import data from "../data/data.json";
import { useNavigation } from "expo-router";
import { useFonts } from "@expo-google-fonts/poppins";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import ClosetDetails from "./closetDetails";

interface Product {
  id: number;
  isFavorite: boolean;
}

interface ProductDetailsParams {
  item: Product;
}

const ClosetStack = () => {
  // const router = useRouter();
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Closet">
      <Stack.Screen name="Closet" component={Closet} />
      <Stack.Screen name="ClosetDetails" component={ClosetDetails} />
    </Stack.Navigator>
  );
};

type ClosetDetailsProps = {
  navigation: StackNavigationProp<RootStackParamList, "ClosetDetails">;
};

type RootStackParamList = {
  ClosetDetails: { isFavorite: boolean };
};

const Closet: React.FC<ClosetDetailsProps> = ({ navigation }) => {
  const [selectedCatagory, setSelectedCatagory] = useState("Shirts");
  const [products, setProducts] = useState(data.products);
  // const navigation = useNavigation();

  const handleClothesClick = () => {
    navigation.navigate("ClosetDetails", { isFavorite: true });
  };

  const toggleFavorite = (
    item: Product,
    products: Product[],
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  ) => {
    setProducts(
      products.map((prod) => {
        if (prod.id === item.id) {
          console.log("prod: ", prod);
          return {
            ...prod,
            isFavorite: !prod.isFavorite,
          };
        }
        return prod;
      })
    );
  };
  const [images, setImages] = useState<string[]>([]);
  // const { sendMessage, lastMessage } = useWebSocket("ws://localhost:8080", {
  //   onOpen: () => console.log("opened"),
  //   onClose: () => console.log("closed"),
  //   onMessage: (message) => {
  //     console.log("use effect message", message);
  //     setImages((images) => [...images, message.data]);
  //   },
  //   shouldReconnect: (closeEvent) => true,
  // });

  // useEffect(() => {
  //   sendMessage("getEmbedding");
  // }, []);

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../assets/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/Poppins-Bold.ttf"),
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView>
      <FlatList
        data={["Shirts", "Pants", "Socks", "Shoes", "Accessories"]}
        renderItem={({ item }) => (
          <Catagory
            item={item}
            selectedCatagory={selectedCatagory}
            setSelectedCatagory={setSelectedCatagory}
          />
        )}
        keyExtractor={(item: any) => item.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        ListHeaderComponent={
          <>
            <>
              <Header isCart={false} />
              <View>
                <Text style={styles.headingText}>Match Your Style</Text>
                <View style={styles.inputContainer}>
                  <Image
                    source={require("../assets/search.png")}
                    style={styles.searchIcon}
                  />
                  <TextInput placeholder="Search" style={styles.textInput} />
                </View>
              </View>
            </>
          </>
        }
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <MyClothesCard
            item={item}
            handleClothesClick={handleClothesClick}
            toggleFavorite={toggleFavorite}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headingText: {
    fontSize: 28,
    color: "#000000",
    marginVertical: 20,
    fontFamily: "Poppins-Regular",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  searchIcon: {
    height: 26,
    width: 26,
    marginHorizontal: 12,
  },
  textInput: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
});
export default ClosetStack;
