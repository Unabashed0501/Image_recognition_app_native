import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
} from "react-native";
import { COLORS } from "../styles/constants";

interface ButtonProps {
  onPress: () => void;
  title: string;
  buttonStyle?: StyleProp<PressableProps>;
  textStyle?: StyleProp<TextStyle>;
}

const PressableButton: React.FC<ButtonProps> = ({
  onPress,
  title,
  buttonStyle,
  textStyle,
}) => {
  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    // paddingHorizontal: 1,
    marginHorizontal: 70,
    overflow: "hidden",
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#154360',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default PressableButton;
