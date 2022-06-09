import {
  Text,
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ViewProps } from "./Themed";

export function EmptyResult({
  style,
}: {
  style?: StyleProp<ViewProps> | ViewStyle;
}) {
  return (
    <View style={[styles.root, style]}>
      <Image
        style={styles.image}
        source={require("../assets/imgs/icon/empty.png")}
      />
      <View style={{ marginTop: 14 }}>
        <Text style={styles.tip}>No activity found</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  tip: {
    color: "#BABABA",
    fontSize: 14,
  },
});
