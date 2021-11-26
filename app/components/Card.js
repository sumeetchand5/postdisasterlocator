import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import Text from "./Text";
import colors from "../config/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { color } from "react-native-reanimated";

function Card({ title, description, subTitle, image, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subTitle} numberOfLines={5}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: "#ffff",
    marginBottom: 10,
    overflow: "hidden",
    margin: 15,
  },
  detailsContainer: {
    padding: 5,
  },
  subTitle: {
    color: colors.medium,
    fontSize: 15,
  },
  title: {
    marginBottom: 7,
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default Card;
