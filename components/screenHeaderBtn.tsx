import React from 'react';
import { Image, TouchableOpacity, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

import styles from '../styles/screenHeaderStyle';

interface ScreenHeaderBtnProps {
  iconUrl: ImageSourcePropType;
  dimension: number | string;
  handlePress: () => void;
}

const ScreenHeaderBtn: React.FC<ScreenHeaderBtnProps> = ({ iconUrl, dimension, handlePress }) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={handlePress}>
      <Image
        source={iconUrl}
        resizeMode='cover'
        style={styles.btnImg(dimension)}
      />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
