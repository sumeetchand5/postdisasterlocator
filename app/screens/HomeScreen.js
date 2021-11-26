import * as React from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import ShowDirections from "./ShowDirections";
import DetailsPage from "./DetailsPage";
import Loading from "../components/Loading";
import { create } from "apisauce";
import { useFocusEffect } from "@react-navigation/native";
import LoadingSimple from "../components/LoadingSimple";

const Stack = createStackNavigator();

let currentLocation = null;
let showButton = 0;

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
  const [location, setLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Function Call on TAb change");
    }, [])
  );

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

  if (loading === true) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LoadingSimple />
      </View>
    );
  }

  let cod = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };

  currentLocation = cod;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}
      >
        <Marker
          coordinate={cod}
          title={"Me"}
          pinColor="#64dd17"
          description={"Your current location"}
        />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(marker.latitude),
              longitude: parseFloat(marker.longitude),
            }}
            title={marker.subject}
            description={marker.Description}
            onCalloutPress={() =>
              navigation.push("DetailsPage", {
                destinationCoordinate: {
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude),
                },
                helpType: marker.subject,
                helpDetails: marker.Description,
                contactDetails: marker.phone,

                currentCoordinate: cod,
              })
            }
            onPress={() => (showButton = 1)}
          />
        ))}
      </MapView>
    </View>
  );
};

export default function HomeScreen() {
  return <StackNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  decoy: {
    marginTop: 30,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  headerMenu: {
    paddingLeft: 10,
  },
  hiddenButton: {
    position: "absolute",
    margin: 200,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 420,
    width: "100%",
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
