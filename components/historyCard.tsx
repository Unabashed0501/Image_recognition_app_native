import React from "react";
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from "react-native";

import styles from "../styles/historyCardStyle";
// import { checkImageURL } from "../../../../utils";

interface Job {
  job_title: string;
  job_employment_type: string;
  employer_logo: string;
  // Add more properties as needed
}

interface HistoryCardProps {
  job: Job;
  handleNavigate: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ job, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          }}
          resizeMode='contain'
          style={styles.logImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {job?.job_title}
        </Text>

        <Text style={styles.jobType}>{job?.job_employment_type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryCard;
