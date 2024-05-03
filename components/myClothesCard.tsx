import { useFonts } from "@expo-google-fonts/poppins";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from "react-native";

// interface Clothes {
//   image: ImageSourcePropType;
//   title: string;
//   price: number;
//   isFavorite: boolean;
// }

interface Clothes {
  id: string;
  isFavorite: boolean;
  imageUrl: string;
  type: string;
  title: string;
}

interface MyClothesCardProps {
  item: Clothes;
  handleClothesClick: (item: Clothes) => void;
  toggleFavorite: (item: Clothes) => void;
}

const MyClothesCard: React.FC<MyClothesCardProps> = ({
  item,
  handleClothesClick,
  toggleFavorite,
}) => {
  //   console.log("item: ", item);
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../assets/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/Poppins-Bold.ttf"),
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        handleClothesClick(item);
      }}
    >
      <Image
        style={styles.coverImage}
        source={{
          uri: item.imageUrl,
        }}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.likeContainer}>
        <TouchableOpacity
          onPress={() => {
            toggleFavorite(item);
          }}
        >
          {item.isFavorite ? (
            <Image
              source={require("../assets/images/favoriteFilled.png")}
              style={styles.favorite}
            />
          ) : (
            <Image
              source={require("../assets/images/favorite.png")}
              style={styles.favorite}
            />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default MyClothesCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  coverImage: {
    height: 256,
    width: "100%",
    borderRadius: 20,
    position: "relative",
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    // fontFamily: "Poppins-Regular",
    fontWeight: "700",
    color: "#444444",
  },
  price: {
    fontSize: 18,
    // fontFamily: "Poppins-Medium",
  },
  likeContainer: {
    position: "absolute",
    padding: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    right: 10,
    top: 10,
  },
  favorite: {
    height: 20,
    width: 20,
  },
});
