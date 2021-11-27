import * as React from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ListItem, Avatar, Badge } from "react-native-elements";
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { create } from "apisauce";

export default RequestLogs = ({ navigation }) => {
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

  const listtwo = [
    {
      title: "Food Ration Assitance",
      icon: "food",
      requestCount: 5,
    },
    {
      title: "Rescue Assistance",
      icon: "handshake",
      requestCount: 1,
    },
    {
      title: "Medical Assistance",
      icon: "medical-bag",
      requestCount: 2,
    },
  ];

  const [assistanceRequest, setAssistanceRequest] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadAssistanceRequest();
  }, []);

  const loadAssistanceRequest = async () => {
    const api = create({ baseURL: "https://jsonplaceholder.typicode.com" });
    const response = await api.get("/posts");
    console.log(response);
    setAssistanceRequest(response.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.spinner, styles.horizontal]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Text style={styles.categoryTitle}>My Assitance History</Text>
        </View>
        <View style={styles.categoryCard}>
          {listtwo.map((item, i) => (
            <ListItem key={i} bottomDivider>
              <MaterialCommunityIcons
                name={item.icon}
                color={colors.primary}
                size={30}
              />

              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
              <Badge
                status="error"
                value={item.requestCount}
                textStyle={{ color: "white" }}
                containerStyle={{ marginTop: -20 }}
              />
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eeeeee",
  },
  categoryCard: {
    backgroundColor: colors.secondary,
    margin: 10,
  },
  filterButton: {
    backgroundColor: colors.white,
    margin: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colors.danger,
    margin: 10,
    padding: 10,
    flexDirection: "row",
    borderRadius: 7,
    textDecorationColor: colors.white,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
  },
  headerMenu: {
    paddingLeft: 10,
    shadowColor: "grey",
  },
  categoryTitle: {
    marginLeft: 13,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
    color: colors.medium,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
