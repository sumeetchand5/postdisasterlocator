import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import AssistanceLogScreen from "../screens/AssistanceLogScreen";
import DeleteRequestScreen from "../screens/DeleteRequestScreen";
import RequestLogs from "../screens/RequestLogs";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Assitance Logs" component={AssistanceLogScreen} />
    <Stack.Screen name="Delete Logs" component={DeleteRequestScreen} />
    <Stack.Screen name="Request Logs" component={RequestLogs} />
  </Stack.Navigator>
);

export default AccountNavigator;
