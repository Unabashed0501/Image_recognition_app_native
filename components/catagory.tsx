import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../styles/searchStyle";

interface CatagoryProps {
  item: string;
  selectedCatagory: string;
  setSelectedCatagory: (item: string) => void;
}

const Catagory: React.FC<CatagoryProps> = ({
  item,
  selectedCatagory,
  setSelectedCatagory,
}) => {
  return (
    <TouchableOpacity onPress={() => setSelectedCatagory(item)}>
      <Text
        style={[
          styles.catagoryText,
          selectedCatagory === item && {
            color: "white",
            backgroundColor: "#E96E6E",
          },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default Catagory;
