import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Catagory from "../components/catagory";
import MyClothesCard from "../components/myClothesCard";
// import Header from "../components/header";
import { queryAllEmbeddings } from "../api/apiClient"; // Import the queryAllEmbeddings function
import { useFonts } from "@expo-google-fonts/poppins";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import ActiveTabs from "../components/activeTabs";
import { COLORS, SIZES } from "../styles/constants";
import ClosetDetails from "./closetDetails";
import { addToFavorites, removeFromFavorites } from "../redux/actions";
import { connect, useDispatch, useSelector } from "react-redux";
import { FavoritesState, RootState } from "../redux/reducers";
import FavoriteItemsPage from "./favoriteItemsPage";

const tabs = ["About", "Qualifications", "Responsibilities"];

interface Product {
  id: string;
  isFavorite: boolean;
  imageUrl: string;
  type: string;
  title: string;
}

const ClosetStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Closet">
      <Stack.Screen name="Closet" component={Closet} />
      <Stack.Screen name="ClosetDetails" component={ClosetDetails} />
      <Stack.Screen name="Favorites" component={FavoriteItemsPage} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

const Closet: React.FC<{ navigation: StackNavigationProp<any> }> = ({
  navigation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("Shirts");
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../assets/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/Poppins-Bold.ttf"),
  });
  const dispatch = useDispatch();
  const favoriteItems = useSelector(
    (state: FavoritesState) => state.favoriteItems
  );
  const displayTabContent = () => {
    switch (activeTab) {
      case "Shirts":
        return <Text>Shirts</Text>;

      case "All":
        return <Text>All</Text>;

      case "Pants":
        return <Text>Pants</Text>;

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allEmbeddings = await queryAllEmbeddings();
        console.log(allEmbeddings);
        // Transform the data into the required format (id, isFavorite, imageUrl, type)
        const transformedProducts: Product[] = allEmbeddings.map(
          (embedding: any) => ({
            id: embedding.metadata.id,
            isFavorite: false, // You may set this to true based on some logic
            imageUrl: embedding.metadata.imageUrl,
            type: embedding.metadata.type,
            title: embedding.metadata.title,
          })
        );
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Favorite Items:", favoriteItems);
  }, [favoriteItems]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleClothesClick = () => {
    // navigation.navigate("ClosetDetails", { isFavorite: true });
    navigation.navigate("Favorites");
  };

  const toggleFavorite = (item: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        if (prod.id === item.id) {
          return {
            ...prod,
            isFavorite: !prod.isFavorite,
          };
        }
        return prod;
      })
    );
    if (item.isFavorite) {
      dispatch(removeFromFavorites(item.id) as any); // Dispatch the removeFromFavorites action
    } else {
      dispatch(addToFavorites(item) as any); // Dispatch the addToFavorites action
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View style={{ padding: SIZES.medium, paddingBottom: 10 }}>
        <ActiveTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {displayTabContent()}
      </View>
      <FlatList
        ListHeaderComponent={
          <>
            {/* <Header isCart={false} /> */}
            <View>
              <Text style={styles.headingText}>Match Your Style</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require("../assets/images/search.png")}
                  style={styles.searchIcon}
                />
                <TextInput placeholder="Search" style={styles.textInput} />
              </View>
            </View>
          </>
        }
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <MyClothesCard
            item={item}
            handleClothesClick={handleClothesClick}
            toggleFavorite={() => toggleFavorite(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const mapStateToProps = (state: RootState) => ({
  products: state.products,
});

const mapDispatchToProps = {
  addToFavorites,
  removeFromFavorites, // Add removeFromFavorites to mapDispatchToProps
};

export default connect(mapStateToProps, mapDispatchToProps)(ClosetStack);

const styles = StyleSheet.create({
  headingText: {
    fontSize: 28,
    color: "#000000",
    marginVertical: 20,
    padding: 10,
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
  },
});
