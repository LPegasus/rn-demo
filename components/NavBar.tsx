import { Image, StyleSheet, View, TouchableOpacity } from "react-native";

export interface NavBarPropsType {
  left?: JSX.Element;
  right?: JSX.Element;
  center?: JSX.Element;
}

export function NavBar(props: NavBarPropsType) {
  const { left, center, right } = props;
  return (
    <View style={styles.root}>
      <View>{left}</View>
      <View>{center}</View>
      <View>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 48,
    backgroundColor: "#8560A9",
    elevation: 4,
    opacity: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
