import * as React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';



const Map = () => {
  <Screen>    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  </Screen>

}

const Stack = createStackNavigator();
const StackNavigator = () => {
  <Stack.Navigator>
    <Stack.Screen name = 'Home' component={Map}/>
  </Stack.Navigator>
}

export default function TestNavigation(){
  return (
  <StackNavigator/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});