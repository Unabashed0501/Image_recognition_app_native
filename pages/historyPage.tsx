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
import { queryAllEmbeddings } from "../api/apiClient";

interface Job {
  job_id: string;
  job_title: string;
  job_employment_type: string;
  employer_logo: string;
  // Add more properties as needed
}
interface Data {
  metadata: {
    id: string;
    date: string;
    title: string;
    type: string;
  };
  label: string;
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
  const [filteredResults, setFilteredResults] = useState<Job[]>([]);
  const [data, setData] = useState<Data[]>([]);

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

  const handleQueryAll = async () => {
    const tmpdata = await queryAllEmbeddings();
    setData(tmpdata);
    // const filteredResults = data.filter((item) => {
    //   // Assuming metadata.postedDate is a property representing the date when the item was posted
    //   const postedDate = new Date(item.metadata.date[0]);
    //   const currentDate = new Date();
    //   const differenceInDays = Math.floor(
    //     (currentDate - postedDate) / (1000 * 60 * 60 * 24)
    //   );

    //   // Display all items from now to the past
    //   return differenceInDays <= days && differenceInDays >= 0;
    // });
    // setFilteredResults(filteredResults);
    // console.log(filteredResults);
    data.sort((a, b) => {
      // Assuming metadata.id is a string representation of the id
      return parseInt(a.metadata.id) - parseInt(b.metadata.id);
    });
  };

  useEffect(() => {
    handleSearch();
    handleQueryAll();
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
        data={data}
        renderItem={({ item }) => (
          <HistoryCard
            job={item}
            handleNavigate={() =>
              navigation.navigate("HistoryDetails", { id: item.metadata.id })
            }
          />
        )}
        keyExtractor={(item) => item.metadata.id}
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
