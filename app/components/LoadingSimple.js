import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import colors from "../config/colors";

export default function LoadingSimple() {
  return (
    <View style={[styles.spinner, styles.horizontal]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

styles = StyleSheet.create({
  spinner: {
    justifyContent: "center",
  },
});
