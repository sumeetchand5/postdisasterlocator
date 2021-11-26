import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, ToastAndroid } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/ButtonPaper";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { create } from "apisauce";
import Loading from "../components/Loading";
import LoadingSimple from "../components/LoadingSimple";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState({ loading: false });
  const [submitLoading, setSubmitLoading] = useState(false);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@userId", value);
      console.log("saved");
    } catch (e) {
      console.log(e);
    }
  };

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setSubmitLoading(true);

    const api = create({
      baseURL: "https://limitless-ravine-58220.herokuapp.com/users",
    });
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    if (response.status === null || response.status != 200) {
      ToastAndroid.show(
        "Something went wrong. Please try again",
        ToastAndroid.SHORT
      );
      setSubmitLoading(false);
      return;
    }

    if (response.data === null) {
      ToastAndroid.show("Username or Password incorrect", ToastAndroid.SHORT);
      setSubmitLoading(false);
      return;
    }

    storeData(String(response.data.userID));
    console.log("user id", response.data.userID);

    navigation.reset({
      index: 0,
      routes: [{ name: "HomeStart" }],
    });

    navigation.navigate("HomeStart", { userID: response.data.userID });
  };

  if (loading == true) {
    return <Loading />;
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      {submitLoading ? (
        <LoadingSimple />
      ) : (
        <Button
          mode="contained"
          onPress={() => {
            onLoginPressed();
          }}
        >
          Login
        </Button>
      )}
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
