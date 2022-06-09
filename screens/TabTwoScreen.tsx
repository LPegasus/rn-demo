import { useState } from "react";
import { FlatList, StyleSheet, Button, Pressable } from "react-native";
import { DateRangePicker } from "../components/DateRangePicker";

import EditScreenInfo from "../components/EditScreenInfo";
import { EmptyResult } from "../components/EmptyResult";
import { Text, View } from "../components/Themed";
import { TooltipPopup } from "../components/TooltipPopup";

export default function TabTwoScreen() {
  const [s, setS] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TooltipPopup
        renderTooltip={(layout) => {
          return (
            <View
              style={{
                top: layout.y + layout.height,
                left: layout.x - layout.width,
                position: "absolute",
              }}
            >
              <DateRangePicker />
            </View>
          );
        }}
      >
        <Pressable>
          <Text>Toggle</Text>
        </Pressable>
      </TooltipPopup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
