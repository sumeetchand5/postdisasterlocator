import React from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/ButtonPaper";
import Paragraph from "../components/Paragraph";

import AppNavigator from "../navigation/AppNavigator";
import { Provider } from "react-native-paper";
import { theme } from "../core/theme";

export default function StartScreen({ navigation }) {
  {
    /* 
    return (
      <Provider theme={theme}>
        <AppNavigator />
      </Provider>
    );
    */
  }

  return (
    <Background>
      <Logo />
      <Header>Post Disaster Locator</Header>
      <Paragraph>Connecting you to help communities!</Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Sign Up
      </Button>
    </Background>
  );
}
