import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import { Input } from "react-native-elements/dist/input/Input";
import colors from "../config/colors";
import { Picker } from "@react-native-picker/picker";
import { Avatar } from "react-native-elements";
import { create } from "apisauce";
import LoadingSimple from "../components/LoadingSimple";
import InputForm from "../components/TextInput";
import InputFormLarge from "../components/TextInputLarge";
import { nameValidator } from "../helpers/nameValidator";
import { emailValidator } from "../helpers/emailValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Stack = createStackNavigator();

let currentLocation = null;
let showButton = 0;

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Seek"
        component={Home}
        options={{
          title: "Seek Help",
          headerRight: () => (
            <Avatar
              rounded
              size={42}
              source={{
                uri: "https://image.pngaaa.com/105/1647105-middle.png",
              }}
            />
          ),
          headerLeft: () => (
            <MaterialCommunityIcons
              style={styles.headerMenu}
              name="menu"
              color={"black"}
              size={35}
            />
          ),
          headerShadowVisible: true,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#fc5c65",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
            alignContent: "center",
          },
        }}
      />
    </Stack.Navigator>
  );
};

const Home = ({ navigation }) => {
  const [location, setLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [AssistanceType, setAssistanceType] = React.useState("Medical Aid");
  const [phoneNumber, setPhoneNumber] = React.useState(null);
  const [emailAddress, setEmailAddress] = React.useState(null);
  const [seekCount, setSeekCount] = React.useState(0);
  const [phone, setPhone] = React.useState({ value: "", error: "" });
  const [description, setDescription] = React.useState({
    value: "",
    error: "",
  });
  const [email, setEmail] = React.useState({ value: "", error: "" });

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@userId");
      return value;
    } catch (e) {
      // error reading value
    }
  };

  const seekAssistanceSubmit = async () => {
    if (seekCount) {
      ToastAndroid.show(
        "Request already submitted. Please delete existing request",
        ToastAndroid.SHORT
      );

      return;
    }

    const phoneError = nameValidator(phone.value);
    const descriptionError = nameValidator(description.value);
    const emailError = emailValidator(email.value);
    if (phoneError || emailError || descriptionError) {
      setPhone({ ...phone, error: phoneError });
      setDescription({ ...description, error: descriptionError });
      setEmail({ ...email, error: emailError });

      return;
    }

    id = await getData();
    console.log(id);

    setSubmitLoading(true);
    const api = create({
      baseURL: "https://limitless-ravine-58220.herokuapp.com/users",
    });

    console.log("herere ", id);
    const response = await api.post(
      "/SeekHelp",
      JSON.stringify({
        userId: id,
        AssistanceType: AssistanceType,
        Description: description,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        PhoneNumber: phoneNumber,
        EmailAddress: emailAddress,
      })
    );

    console.log(response);
    setSubmitLoading(false);

    if (response.status === null || response.status != 200) {
      ToastAndroid.show(
        "Something went wrong. Please try again",
        ToastAndroid.SHORT
      );
      setLoading(false);
      return;
    }

    ToastAndroid.show("Request submitted successfully", ToastAndroid.SHORT);
    setSeekCount(1);
  };

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      setLocation(location);
      setLoading(false);
    })();
  }, []);

  if (loading === true) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  let cod = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };

  currentLocation = cod;

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={styles.pickerTextStyle}>Select Help Type</Text>
        <Picker
          style={styles.pickerStyle}
          selectedValue={AssistanceType}
          onValueChange={(itemValue, itemIndex) => setAssistanceType(itemValue)}
        >
          <Picker.Item label="Medical Aid" value="Medical Aid" />
          <Picker.Item label="Food Ration Aid" value="Food Ration" />
          <Picker.Item label="Emergency Rescue" value="Emergency" />
        </Picker>

        <View style={styles.inputContainer}>
          <Text style={styles.text}>Your Phone Number</Text>
          <InputForm
            label="Phone"
            returnKeyType="done"
            value={phone.value}
            onChangeText={(text) => {
              const phoneError = nameValidator(phone.value);
              setPhone({ value: text, phoneError: "" });
            }}
            error={!!phone.error}
            errorText={phone.error}
          />
          <Text style={styles.text}>Your Email Address</Text>
          <InputForm
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => {
              const error = emailValidator(email.value);
              setEmail({ value: text, error: "" });
            }}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Enter Help Description</Text>
          <InputFormLarge
            label="Help Description"
            returnKeyType="done"
            value={description.value}
            onChangeText={(text) => {
              const error = nameValidator(description.value);
              setDescription({ value: text, error: "" })}} 
            error={!!description.error}
            errorText={description.error}
          />
        </View>
        {submitLoading === true ? (
          <LoadingSimple />
        ) : (
          <Button
            title="Submit"
            onPress={() => {
              console.log({
                userId: 14583113,
                PhoneNumber: phoneNumber,
                EmailAddress: emailAddress,
                Description: description,
                AssistanceType: AssistanceType,
                latitude: cod.latitude,
                longitude: cod.longitude,
              });
              seekAssistanceSubmit();
            }}
          />
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default function SeekHelp() {
  return <StackNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    //backgroundColor:'#e0e0e0',
  },
  inputContainer: {
    marginTop: 10,
    margin: 10,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 20,
  },
  text: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
    color: colors.medium,
  },
  keyboardAvoid: {
    flex: 1,
  },
  pickerTextStyle: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 0,
    fontWeight: "bold",
    fontSize: 15,
    color: colors.medium,
  },
  headerMenu: {
    paddingLeft: 0,
    shadowColor: "grey",
  },
  inputStyle: {
    fontSize: 16,
    marginLeft: 10,
  },
  descriptionInput: {
    height: 100,
  },
  pickerStyle: {
    marginLeft: 15,
    marginTop: 15,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    color: colors.primary,
    fontSize: 19,
  },
});
