import MapViewDirections from "react-native-maps-directions";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as React from "react";
import { StyleSheet, View, Dimensions } from "react-native";

const GOOGLE_MAPS_APIKEY = "AIzaSyAcYy48u8aT7DkmhVyy6e2i5ZgsunHDLzk";

export default function ({ route, navigation }) {
  const { currentCoordinate, destinationCoordinate } = route.params;
  console.log(currentCoordinate);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentCoordinate.latitude,
          longitude: currentCoordinate.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}
      >
        <Marker coordinate={currentCoordinate} pinColor="#64dd17" />
        <Marker coordinate={destinationCoordinate} />
        <MapViewDirections
          lineDashPattern={[1]}
          strokeWidth={7}
          strokeColor="crimson"
          origin={currentCoordinate}
          destination={destinationCoordinate}
          apikey={GOOGLE_MAPS_APIKEY}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
