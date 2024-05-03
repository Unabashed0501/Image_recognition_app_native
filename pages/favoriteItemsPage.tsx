import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { FavoritesState } from "../redux/reducers"; // Assuming RootState is your root state type

const FavoriteItemsPage: React.FC = () => {
  // Read data from the store with the useSelector hook
  const favoriteItems = useSelector(
    (state: FavoritesState) => state.favoriteItems
  );

  console.log(favoriteItems);
  return (
    <View>
      <Text>Favorite Items:</Text>
      {favoriteItems.map((item) => (
        <Text key={item.id}>{item.title}</Text>
      ))}
    </View>
  );
};

export default FavoriteItemsPage;
