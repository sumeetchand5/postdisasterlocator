import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
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
import * as Location from "expo-location";
import ShowDirections from "./ShowDirections";
import DetailsPage from "./DetailsPage";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Post Disaster Response",
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

      <Stack.Screen
        name="DetailsPage"
        component={DetailsPage}
        options={{
          title: "Details",
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

      <Stack.Screen
        name="ShowDirectionsPage"
        component={ShowDirections}
        options={{
          title: "Assistance",
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
  let keyExtractor = (item, index) => index.toString();
  const [location, setLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const api = create({
        baseURL: "https://limitless-ravine-58220.herokuapp.com/users",
      });
      const response = await api.get("/CurrentHelpRequests");
      console.log(response.data);

      if (response.status === null || response.status != 200) {
        ToastAndroid.show(
          "Something went wrong. Please try again",
          ToastAndroid.SHORT
        );
        setLoading(false);
        return;
      }

      console.log(location);
      setLocation(location);
      setMarkers(response.data);
      setLoading(false);
    })();
  }, []);

  let renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <MaterialCommunityIcons
        name={
          item.subject === "Medical Aid"
            ? "medical-bag"
            : item.subject === "Food Ration"
            ? "food"
            : "handshake"
        }
        color={colors.primary}
        size={30}
      />
      <ListItem.Content>
        <ListItem.Title>{item.subject}</ListItem.Title>
        <ListItem.Subtitle>{item.Description}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  const list = [
    {
      subject: "Medical Aid",
      Description: "11/Nov/21",
    },
    {
      subject: "Food Ration",
      Description: "10/Nov/21",
    },
    {
      subject: "Medical Aid",
      Description: "25/Oct/21",
    },
    {
      subject: "Medical Aid",
      Description: "20/Oct/21",
    },
  ];

  if (loading) {
    return (
      <View style={[styles.spinner, styles.horizontal]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.filterButton}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>Medical</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>Ration</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>Emergency</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.categoryTitle}>Current Help Requests</Text>
          </View>
          <View style={styles.categoryCard}>
            {markers.map((item, i) => (
              <ListItem
                key={i}
                onPress={() => {
                  navigation.push("DetailsPage", {
                    destinationCoordinate: {
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    },
                    helpType: item.subject,
                    helpDetails: item.Description,
                    contactDetails: item.phone,

                    currentCoordinate: {
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    },
                  });
                }}
              >
                <MaterialCommunityIcons
                  name={
                    item.subject === "Medical Aid"
                      ? "medical-bag"
                      : item.subject === "Food Ration"
                      ? "food"
                      : "handshake"
                  }
                  color={colors.primary}
                  size={30}
                />

                <ListItem.Content>
                  <ListItem.Title>{item.subject}</ListItem.Title>
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

          <View>
            <Text style={styles.categoryTitle}>My Assistance History</Text>
          </View>

          <View style={styles.categoryCard}>
            <FlatList
              keyExtractor={keyExtractor}
              data={list}
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default function HomeScreen() {
  return <StackNavigator />;
}

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
