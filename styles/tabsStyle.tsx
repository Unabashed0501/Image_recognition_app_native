import { StyleSheet } from "react-native";
import { COLORS, SHADOWS, SIZES } from "./constants";

interface Styles {
  container: {
    marginTop: number;
    marginBottom: number;
  };
  btn: (name: string, activeTab: string) => {
    paddingVertical: number;
    paddingHorizontal: number;
    backgroundColor: string;
    borderRadius: number;
    marginLeft: number;
    shadowColor: string;
  };
  btnText: (name: string, activeTab: string) => {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginTop: SIZES.small,
    marginBottom: SIZES.small / 2,
  },
  btn: (name, activeTab) => ({
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xLarge,
    backgroundColor: name === activeTab ? COLORS.primary : "#F3F4F8",
    borderRadius: SIZES.medium,
    marginLeft: 2,
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  }),
  btnText: (name, activeTab) => ({
    fontFamily: "DMMedium",
    fontSize: SIZES.small,
    color: name === activeTab ? "#C3BFCC" : "#AAA9B8",
  }),
});

export default styles;
