import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { FavoritesState } from "../redux/reducers";
import useWebSocket, { ReadyState } from "react-native-use-websocket";
import { SHADOWS, SIZES, COLORS } from "../styles/constants";

const FavoriteItemsPage: React.FC = () => {
  const [socketUrl, setSocketUrl] = useState("ws://10.10.3.110:81");
  const { sendMessage } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("opened"),
      onClose: () => console.log("closed"),
      // Received a message from the server. This will be called every time a new message is received
      onMessage: (message) => {
        if (message.data == "success") {
          console.log("Clothes are ready to be displayed ~");
        }
      },
      shouldReconnect: (closeEvent) => true,
    }
  );
  const msg = [1, 2, 3];
  const handleClickSendMessage = React.useCallback(() => {
    sendMessage("get ready");
    console.log("sent get ready");
  }, []);

  // Read data from the store with the useSelector hook
  const favoriteItems = useSelector(
    (state: FavoritesState) => state.favoriteItems
  );

  console.log(favoriteItems);
  return (
    <View>
      <Text style={styles.header}>Favorite Items:</Text>
      {favoriteItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            {/* <Text style={styles.description}>{item.description}</Text> */}
          </View>
        </View>
      ))}
      <View style={styles.btnContainer}>
      <TouchableOpacity
        style={styles.btnClick}
        onPress={handleClickSendMessage}
      >
        <Text style={styles.btnText}>Send Message</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    // fontWeight: "bold",
    marginBottom: 10,
    padding: 16,
    // color: COLORS.primary,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  btnClick: {
    width: "35%",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xLarge,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    marginLeft: 2,
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  btnText: {
    fontFamily: "DMMedium",
    fontWeight: "bold",
    fontSize: SIZES.small,
    color: "white",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default FavoriteItemsPage;
