import { Text, StyleSheet, View } from "react-native";

export function SectionLabel({ children }: { children: string }) {
  return (
    <View style={styles.root}>
      <View style={styles.divider} />
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "#8560A9",
    height: 18,
    marginRight: 4,
  },
  text: {
    textTransform: "capitalize",
    color: "#8560A9",
    fontSize: 16,
    fontWeight: "700",
  },
});
