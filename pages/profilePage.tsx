import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

type RootStackParamList = {
  EditableProfilePage: any | undefined;
};

type EditableProfilePageNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditableProfilePage"
>;

type Props = {
  navigation: EditableProfilePageNavigationProp;
};

const EditableProfilePage: React.FC<Props> = (navigation) => {
  const [name, setName] = useState("Oscar Fu");
  const [email, setEmail] = useState("oscarfu0501@gmail.com");
  const [bio, setBio] = useState("A passionate developer.");
  const [dateOfBirth, setDateOfBirth] = useState("2003-05-01");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSave = () => {
    navigation.goBack();
  };

  const handleSelectPicture = () => {
    // Here you can implement logic to select a profile picture
    console.log("Select Profile Picture");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectPicture}>
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <View style={styles.placeholderProfilePicture}>
            <Text style={styles.profilePictureText}>Select Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Bio:</Text>
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={bio}
        onChangeText={setBio}
        placeholder="Enter your bio"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Date of Birth:</Text>
      <TextInput
        style={styles.input}
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder="YYYY-MM-DD"
        keyboardType="numeric"
      />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  bioInput: {
    height: 100, // Adjust the height for the bio input
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderProfilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePictureText: {
    fontSize: 16,
    color: "#888",
  },
});

export default EditableProfilePage;
