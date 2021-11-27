import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ToastAndroid,
} from "react-native";
import Card from "../components/Card";
import Button from "../components/Button";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ListItem, Avatar, Badge } from "react-native-elements";
import colors from "../config/colors";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import InputFormLarge from "../components/TextInputLarge";
import { nameValidator } from "../helpers/nameValidator";
import LoadingSimple from "../components/LoadingSimple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "apisauce";

export default detailsPage = ({ route, navigation }) => {
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const api = create({
        baseURL: "https://limitless-ravine-58220.herokuapp.com/users",
      });
      const response = await api.get("/GetAssistanceReceived");

      if (response.status === null || response.status != 200) {
        ToastAndroid.show(
          "Something went wrong. Please try again",
          ToastAndroid.SHORT
        );

        setLoading(false);
        return;
      }

      console.log(HelpRequesterUserId);

      setList(
        response.data
          .map((value) => {
            return {
              HelpType: value.HelpType,
              userId: value.HelpRequesterUserId,
            };
          })
          .filter((value) => value.userId == HelpRequesterUserId)
      );

      setLoading(false);
    })();
  }, []);

  const {
    currentCoordinate,
    destinationCoordinate,
    helpType,
    helpDetails,
    contactDetails,
    HelpRequesterUserId,
  } = route.params;

  let keyExtractor = (item, index) => index.toString();

  let renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar
        title={item.name[0]}
        source={item.avatar_url && { uri: item.avatar_url }}
      />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [AssistanceType, setAssistanceType] = React.useState("Medical Aid");
  const [description, setDescription] = React.useState({
    value: "",
    error: "",
  });
  const [list, setList] = React.useState([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@userId");
      return value;
    } catch (e) {
      // error reading value
    }
  };

  const submitHelp = async () => {
    const descriptionError = nameValidator(description.value);
    if (descriptionError) {
      setDescription({ ...description, error: descriptionError });
      return;
    }
    setLoading(true);
    id = await getData();

    const api = create({
      baseURL: "https://limitless-ravine-58220.herokuapp.com/users",
    });

    const response = await api.post(
      "/SubmitAssistanceReceived",
      JSON.stringify({
        userId: id,
        HelpRequesterUserId,
        HelpType: AssistanceType,
        HelpDescription: description,
      })
    );

    console.log(response);

    if (response.status === null || response.status != 200) {
      ToastAndroid.show(
        "Something went wrong. Please try again",
        ToastAndroid.SHORT
      );
      setLoading(false);
      return;
    }

    //add newly updated data into state to reflect changes
    ToastAndroid.show("Request submitted successfully", ToastAndroid.SHORT);

    const listtemp = list;
    listtemp.push({ HelpType: AssistanceType, userId: 1 });
    setList(listtemp);

    setLoading(false);
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.Container}>
      <ScrollView>
        <View>
          <Text style={styles.categoryTitle}>Help Request Details</Text>
        </View>

        <View style={styles.cardContainer}>
          <Card title="Help Type" description={helpType} />
          <Card title="Details" description={helpDetails} />
          <Card title="Contact Details" description={contactDetails} />
        </View>

        <View>
          <Text style={styles.categoryTitle}>Current Received Assistance</Text>
        </View>
        {loading ? (
          <LoadingSimple />
        ) : (
          <View style={styles.categoryCard}>
            {list.map((item, i) => (
              <ListItem key={i} bottomDivider>
                <MaterialCommunityIcons
                  name={
                    item.HelpType === "Medical Aid"
                      ? "medical-bag"
                      : item.HelpType === "Food Ration"
                      ? "food"
                      : "handshake"
                  }
                  color={colors.primary}
                  size={30}
                />

                <ListItem.Content>
                  <ListItem.Title>{item.HelpType}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </View>
        )}

        <View style={styles.buttonContainerMain}>
          <Button
            title="Help Now"
            onPress={() => {
              navigation.push("ShowDirectionsPage", {
                destinationCoordinate,
                currentCoordinate,
              });
            }}
          />
          <Button
            title="Confirm Help"
            color="lightseagreen"
            onPress={toggleModal}
          />
        </View>
      </ScrollView>

      <View style={styles.modalContainer}>
        <Modal
          isVisible={isModalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          <View style={styles.modalForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Select Assistance Type</Text>

              <Picker
                style={styles.pickerStyle}
                selectedValue={AssistanceType}
                onValueChange={(itemValue, itemIndex) =>
                  setAssistanceType(itemValue)
                }
              >
                <Picker.Item label="Medical Aid" value="Medical Aid" />
                <Picker.Item label="Food Ration Aid" value="Food Ration" />
                <Picker.Item label="Emergency Rescue" value="Emergency" />
              </Picker>

              <Text style={styles.text}>Enter Help Description</Text>
              <InputFormLarge
                label="Help Description"
                returnKeyType="done"
                value={description.value}
                onChangeText={(text) => {
                  const error = nameValidator(description.value);
                  setDescription({ value: text, error: "" });
                }}
                error={!!description.error}
                errorText={description.error}
              />
            </View>
            {loading ? (
              <LoadingSimple />
            ) : (
              <View style={styles.buttonContainer}>
                <Button title="Submit" onPress={submitHelp} />
                <Button
                  title="Cancel"
                  onPress={toggleModal}
                  color="lightseagreen"
                />
              </View>
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    //backgroundColor: "#f5f5f5",
    backgroundColor: "#eeeeee",
    padding: 4,
  },
  categoryTitle: {
    marginLeft: 13,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    color: colors.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 220,
    marginLeft: 30,
  },
  buttonContainerMain: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: 300,
    marginLeft: 30,
    marginTop: 5,
    flex: 1,
  },
  categoryCard: {
    backgroundColor: colors.secondary,
    margin: 15,
  },
  modalContainer: {
    flex: 1,
  },
  text: {
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 15,
    color: "#616161",
  },
  modalForm: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    flex: 1,
    maxHeight: 400,
    opacity: 1,
    padding: 20,
  },
  inputStyle: {
    fontSize: 16,
    marginLeft: 10,
  },
  descriptionInput: {
    height: 150,
    backgroundColor: "#ffff",
    borderRadius: 10,
    marginBottom: 40,
  },
  pickerStyle: {
    backgroundColor: "#fff",
    borderRadius: 50,
    color: colors.primary,
    fontSize: 19,
    marginBottom: 10,
  },
});
