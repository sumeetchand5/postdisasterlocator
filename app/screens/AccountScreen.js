import React from "react";
import { StyleSheet, View, FlatList, TextInput } from "react-native";
import Button from "../components/Button";

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import Screen from "../components/Screen";

const menuItems = [
  {
    title: "Delete Help Requests",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.DELETELOG,
  },
  {
    title: "My Assitance Logs ",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.ASSISTANCELOG,
  },
];

function AccountScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title="Sumeet Ram Chand"
          subTitle="sumeet.r.chand@gmail.com"
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
        />
      </View>
      <View style={{ marginTop: 35 }}>
        <Button
          title="Sign Out"
          onPress={() => navigation.replace("LoginScreen")}
        />
      </View>
    </Screen>
  );
}

const theme = {
  Button: {
    raised: true,
    backgroundColor: "crimson",
  },
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
  logoutButtonStyle: {
    margin: 50,
    padding: 50,
    fontWeight: "bold",
    backgroundColor: "crimson",
  },
});

export default AccountScreen;
