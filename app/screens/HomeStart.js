import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import navigationTheme from "../navigation/navigationTheme";
import AppNavigator from "../navigation/AppNavigator";
import { Provider } from "react-native-paper";
import { theme } from "../core/theme";

export default function App({ route, navigation }) {

  return (
    <Provider theme={theme}>
      <AppNavigator />
    </Provider>
  );
}
