import React from "react";
import { RouteProp } from "@react-navigation/native";
import { View, Text } from "react-native";

type RootStackParamList = {
  HistoryDetails: { id: string };
};

type HistoryDetailsRouteProp = RouteProp<RootStackParamList, "HistoryDetails">;

type Props = {
  route: HistoryDetailsRouteProp;
};

const HistoryDetails: React.FC<Props> = ({ route }) => {
  const { id } = route.params;

  return (
    <View>
      <Text>History Details Screen</Text>
      <Text>ID: {id}</Text>
    </View>
  );
};

export default HistoryDetails;
