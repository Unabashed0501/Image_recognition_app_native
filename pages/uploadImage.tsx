import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getEmbedding, getProcessedImage, queryEmbedding, saveEmbedding } from "../api/apiClient";
import BottomModal from "../components/BottomModal";

const UploadImagePage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const [base64Image, setBase64Image] = useState<string>("");

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      // If permission is denied, show an alert
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera  
             roll permission to upload images.`
      );
    } else {
      // Launch the image library and get
      // the selected image
      //   const result = await ImagePicker.launchImageLibraryAsync();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      if (!result.canceled) {
        // If an image is selected (not cancelled),
        // update the file state variable
        setImage(result.assets![0].uri);
        const base64Image = await convertImageToBase64(result.assets![0].uri);
        console.log(base64Image);
        setBase64Image(base64Image);
        // Clear any previous errors
        setError(null);
      }
    }
  };

  const handleSaveEmbeddings = async (imageBase64: string, metadata: any) => {
    // if (!image) {
    //   console.log("Please upload an image.");
    //   return;
    // }

    try {
      //   const base64Image = await convertImageToBase64(image);
      //   const metadata = {
      //     imageBase64: base64Image,
      //     metadata: {
      //       title,
      //       id,
      //       type,
      //     },
      //   };
      const requestData = {
        imageBase64,
        metadata,
      };

      console.log(requestData);
      await saveMetadataToDatabase(requestData);
      console.log("Metadata saved successfully!");
    } catch (error) {
      console.error("Error saving metadata:", error);
    }
  };

  const convertImageToBase64 = async (imageUri: string) => {
    console.log("Converting image to base64...");
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  };

  const saveMetadataToDatabase = async (requestData: any) => {
    // Your logic to save metadata to the database
    console.log("Saving metadata to database...");
    // console.log(metadata);
    const { imageBase64, metadata } = requestData;
    await saveEmbedding(imageBase64, metadata);
    console.log("Saved metadata to database");
  };
  //   const data = {
  //     imageBase64: `data:image/jpeg;base64,${base64}`,
  //     metadata: {
  //       title: "Lazy Cat Tee",
  //       type: "Shirt",
  //       id: "5",
  //     },
  //   };
  const handleProcessedImage = async () => {
    const requestData = {
      // path: "http://10.10.2.100/cam-lo.jpg",
      path: "https://wtfunk.tw/%E5%A4%A7%E5%B0%8F/P641%E7%B6%A0370.jpg",
    //   path: "https://www.next.us/nxtcms/resource/blob/5791586/ee0fc6a294be647924fa5f5e7e3df8e9/hoodies-data.jpg",
    };
    const imageBase64 = await getProcessedImage(requestData);
    console.log("get imageBase64:", imageBase64);
    const values = await getEmbedding(imageBase64);
    console.log("values: ", values);
    const data = await queryEmbedding(values, "default");
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Text>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text>ID:</Text>
      <TextInput
        style={styles.input}
        value={id}
        onChangeText={setId}
        placeholder="Enter ID"
      />
      <Text>Type:</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Enter type"
      />
      <Button title="Upload Image" onPress={handleImageUpload} />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        // Display an error message if there's
        // an error or no image selected
        <Text style={styles.errorText}>{error}</Text>
      )}
      <Button
        title="Save Metadata"
        onPress={() => handleSaveEmbeddings(base64Image, { image, title, id, type })}
      />
      {/* <Button title="Get Processed Image" onPress={handleProcessedImage} /> */}
      {/* {BottomModal()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginTop: 20,
  },
  imageContainer: {
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },

  errorText: {
    color: "red",
    marginTop: 16,
  },
});

export default UploadImagePage;
