import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";

import styles from "../styles/historyCardStyle";
// import { checkImageURL } from "../../../../utils";

interface Data {
  metadata: {
    id: string;
    date: string;
    title: string;
    type: string;
  };
  label: string;
}

interface HistoryCardProps {
  job: Data;
  handleNavigate: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ job, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={{
            uri: job.metadata.imageUrl,
          }}
          resizeMode="contain"
          style={styles.logImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {job?.metadata.title}
        </Text>
        <View style={styles.stextContainer}>
          <Text style={styles.jobType}>{job?.metadata.type}</Text>
          <Text style={styles.jobType}>{job?.metadata.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryCard;
