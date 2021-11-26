import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AccountNavigator from "./AccountNavigator";
import FeedNavigator from "./FeedNavigator";
import HomeScreen from "../screens/HomeScreen";
import ListScreen from "../screens/ListScreen";
import SeekHelp from "../screens/SeekHelpScreen";
import colors from "../config/colors";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      keyboardHidesTabBar: true,
      labelStyle: {
        fontSize: 11,
        fontWeight: "bold",
        margin: 0,
        padding: 0,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabelStyle: {
          fontSize: 30,
        },
        headerTitle: "Map",
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={30} />
        ),
      }}
    />
    <Tab.Screen
      name="Feed"
      component={ListScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="view-list" color={color} size={30} />
        ),
      }}
    />

    <Tab.Screen
      name="Seek Help"
      component={SeekHelp}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="map-marker-radius"
            color={color}
            size={30}
          />
        ),
      }}
    />

    <Tab.Screen
      name="Manage"
      component={AccountNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={30} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default AppNavigator;
