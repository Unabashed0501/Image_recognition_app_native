// UpdateDataPage.tsx

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { updateEmbedding } from "../api/apiClient";

interface Product {
  id: string;
  isFavorite: boolean;
  imageUrl: string;
  type: string;
  title: string;
}

type RootStackParamList = {
  UpdateDataPage: { item: any };
};

type UpdateDataPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UpdateDataPage"
>;

type Props = {
  navigation: UpdateDataPageNavigationProp;
  item: Product;
  //   route: { params: { itemId: string } };
};

const UpdateDataPage: React.FC<Props> = ({ item, navigation }) => {
  //   const { itemId } = route.params;

  const [title, setTitle] = useState<string>(""); // Initialize with fetched title
  const [type, setType] = useState<string>(""); // Initialize with fetched type

  const handleSubmit = async () => {
    // Handle form submission here
    const metadata = {
      title: title,
      type: type,
      // Add other metadata fields here
    };

    // Call updateEmbedding function to update the embedding
    await updateEmbedding(item.id, metadata);
    // You can use the 'title', 'type', and other state variables to update the data in the database
    navigation.goBack(); // Navigate back after submission
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={item?.title}
      />
      <Text style={styles.label}>Type:</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Enter type"
      />
      {/* Add more input fields for other data */}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default UpdateDataPage;
