// import * as React from "react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-native-use-websocket";
import { Buffer } from "buffer";
import {
  View,
  Button,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const WebSocketDemo: React.FC = () => {
  // const [socketUrl, setSocketUrl] = useState("ws://localhost:8080");
  const [socketUrl, setSocketUrl] = useState("ws://10.10.2.100:81");
  const messageHistory = useRef<any[]>([]);
  const [base64Image, setBase64Image] = useState<string>("");

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("opened"),
      onClose: () => console.log("closed"),
      // Received a message from the server. This will be called every time a new message is received
      onMessage: (message) => {
        if(message.data instanceof ArrayBuffer){
            const uint8Array = new Uint8Array(message.data);
            const blob = new Blob([uint8Array], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(blob);
            setBase64Image(imageUrl);
        }
        // console.log("type", typeof message.data);    
        // if (typeof message.data === "object") {
          // const imageData = Buffer.from(Uint8Array.from(message.data)).toString("base64");
        //   const arrayBuffer = new Uint8Array(message.data); // Convert ArrayBuffer to Uint8Array
        //   const imageData = Buffer.from(arrayBuffer).toString("base64");
        //   console.log(JSON.stringify({ imageData }));
        //   setBase64Image(imageData);
          // const reader = new FileReader();
          // reader.readAsDataURL(message.data);
          // reader.onloadend = () => {
          //   setBase64Image(reader.result as string);
          // };
        //   console.log("is object");
        // }
      },
      // Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    }
  );

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
      {/* <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul> */}
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
});

export default WebSocketDemo;
