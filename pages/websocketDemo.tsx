// import * as React from "react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-native-use-websocket";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  View,
  Button,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Modal,
} from "react-native";
import {
  getEmbedding,
  getProcessedImage,
  queryEmbedding,
} from "../api/apiClient";
import BottomModal from "../components/BottomModal";

const WebSocketDemo: React.FC = () => {
  // const [socketUrl, setSocketUrl] = useState("ws://localhost:8080");
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
      // Received a message from the server. This will be called every time a new message is received
      onMessage: async (message) => {
        // if (message.data instanceof ArrayBuffer) {
        //   const uint8Array = new Uint8Array(message.data);
        //   const blob = new Blob([uint8Array], { type: "image/jpeg" });
        //   const imageUrl = URL.createObjectURL(blob);
        //   setBase64Image(imageUrl);
        // }
        let trimmedStr: string = message.data.trim();
        let comparisonResult: number =
          trimmedStr.localeCompare("start streaming");
        console.log("Received msg: ", message.data);
        console.log(comparisonResult);
        if (comparisonResult === 0) {
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

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl("ws://localhost:8080"),
    []
  );

  const handleCloseConnection = () => {
    getWebSocket()?.close();
  };

  const handleClickSendMessage = React.useCallback(() => {
    sendMessage("start");
    console.log("sent Hello");
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const bottomSheetRef = useRef<BottomSheet>(null);

  // useEffect(() => {
  //   if (lastJsonMessage) {
  //     setIsModalVisible(true);
  //   }
  // }, [lastJsonMessage]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    bottomSheetRef.current?.close();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
        title={"Click Me to send 'Hello'"}
      />
      <Text>The WebSocket is currently {connectionStatus}</Text>
      <Button onPress={handleCloseConnection} title="Close Connection" />
      <Button onPress={handleClickChangeSocketUrl} title="Change Connection" />
      <Button onPress={handleProcessedImage} title="Get Processed Image" />
      {lastMessage ? <Text>Last message: {lastMessage.data}</Text> : null}
      <FlatList
        keyExtractor={(item, i) => {
          return i.toString();
        }}
        data={messageHistory.current}
        renderItem={({ item }) =>
          item && item.message && <Text>{item.message.data}</Text>
        }
      />
      {base64Image && (
        <Image
          style={{ width: 200, height: 200 }} // Set width and height as needed
          source={{ uri: `${base64Image}` }} // Adjust MIME type and image size accordingly
        />
      )}

      <Button title="Open Modal" onPress={() => setIsModalVisible(true)} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
  },
});

export default WebSocketDemo;
