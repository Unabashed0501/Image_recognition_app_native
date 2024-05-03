import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Text, SafeAreaView } from "react-native";

import HistoryCard from "../components/historyCard";
import ScreenHeaderBtn from "../components/screenHeaderBtn";
import { COLORS, SIZES } from "../styles/constants";
import icons from "../styles/icons";
import styles from "../styles/searchStyle";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import HistoryDetails from "./historyDetails";

interface Job {
  job_id: string;
  job_title: string;
  job_employment_type: string;
  employer_logo: string;
  // Add more properties as needed
}

const localData: Job[] = [
  {
    job_id: "1",
    job_title: "Software Engineer",
    job_employment_type: "Full Time",
    employer_logo: "https://example.com/logo1.png",
  },
  {
    job_id: "2",
    job_title: "UX Designer",
    job_employment_type: "Part Time",
    employer_logo: "https://example.com/logo2.png",
  },
  // Add more job objects as needed
];

const HistoryStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="History">
      <Stack.Screen name="History" component={HistoryPage} />
      <Stack.Screen name="HistoryDetails" component={HistoryDetails} />
    </Stack.Navigator>
  );
};

type RootStackParamList = {
  HistoryDetails: { id: string };
};

const HistoryPage: React.FC<{
  navigation: StackNavigationProp<RootStackParamList>;
}> = ({ navigation }) => {
  const params = useLocalSearchParams();
//   const router = useRouter();

  const [searchResult, setSearchResult] = useState<Job[]>([]);
  const [searchLoader, setSearchLoader] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);

  const handleSearch = () => {
    setSearchLoader(true);
    setSearchResult(localData);
    setSearchLoader(false);
  };

  const handlePagination = (direction: "left" | "right") => {
    if (direction === "left" && page > 1) {
      setPage(page - 1);
    } else if (direction === "right") {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      {/* <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => navigation.pop()}
            />
          ),
          headerTitle: "",
        }}
      /> */}

      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <HistoryCard
            job={item}
            handleNavigate={() =>
              navigation.navigate("HistoryDetails", { id: item.job_id })
            }
          />
        )}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <Text style={styles.searchTitle}>{params.id}</Text>
              <Text style={styles.noOfSearchedJobs}>My Clothing History</Text>
            </View>
            <View style={styles.loaderContainer}>
              {searchLoader ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                searchError && <Text>Oops something went wrong</Text>
              )}
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination("left")}
            >
              <Image
                source={icons.chevronLeft}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.paginationTextBox}>
              <Text style={styles.paginationText}>{page}</Text>
            </View>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination("right")}
            >
              <Image
                source={icons.chevronRight}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HistoryStack;
