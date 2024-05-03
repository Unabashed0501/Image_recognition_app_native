import React from "react";
import { TouchableOpacity, FlatList, Text, View } from "react-native";

import styles from "../styles/tabsStyle";
import { SIZES } from "../styles/constants";

interface TabButtonProps {
  name: string;
  activeTab: string;
  onHandleSearchType: () => void;
}

function TabButton({ name, activeTab, onHandleSearchType }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={styles.btn(name, activeTab)}
      onPress={onHandleSearchType}
    >
      <Text style={styles.btnText(name, activeTab)}>{name}</Text>
    </TouchableOpacity>
  );
}

interface ActiveTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const ActiveTabs: React.FC<ActiveTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TabButton
            name={item}
            activeTab={activeTab}
            onHandleSearchType={() => setActiveTab(item)}
          />
        )}
        contentContainerStyle={{ columnGap: SIZES.small / 2 }}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default ActiveTabs;
