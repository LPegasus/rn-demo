import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Video } from "./FlattenAutoPlay/Video";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  return (
    <View style={styles.container}>
      <View>
        <Button
          title="Goto Feed"
          onPress={() => {
            navigation.push("Feeds", {});
          }}
        />
      </View>
      <Button
        title="Goto SearchPanel"
        onPress={() => {
          navigation.push("SearchPanel", {});
        }}
      />
      <Button
        title="Goto Me"
        onPress={() => {
          navigation.push("Me");
        }}
      />
      <Button
        title="Goto Detail"
        onPress={() => {
          navigation.push("Detail", { id: "" });
        }}
      />
      <Button
        title="Goto InputTest"
        onPress={() => {
          navigation.push("InputTest");
        }}
      />
      <Button
        title="Goto autoplay"
        onPress={() => {
          navigation.push("FlattenAutoPlay");
        }}
      />
      <Video dur={3000} isPlaying={true} />
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
