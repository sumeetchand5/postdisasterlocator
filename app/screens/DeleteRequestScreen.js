import * as React from "react";
import { StyleSheet, View } from "react-native";
import Card from "../components/Card";
import colors from "../config/colors";
import Button from "../components/Button";

export default AssitanceLog = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Card title="Help Type" description="Medical Aid" />
        <Card
          title="Details"
          description="Family member got injured during the storm, need basic first aid kit to clean the wound and bandage"
        />
        <Card title="Contact Details" description="9998166" />
        <View style={styles.decoy}></View>
        <View style={{ paddingTop: 10, marginTop: 40 }}>
          <Button title="Delete Request" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eeeeee",
    flex: 1,
  },
  cardContainer: {
    padding: 15,
  },
});
