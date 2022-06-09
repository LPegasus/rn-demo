import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

export function MaskView(props: {
  onClose(): void;
  visible?: boolean;
  style?: ViewStyle;
}) {
  const { visible = true, onClose } = props;
  if (!visible) {
    return null;
  }
  return (
    <Pressable onPress={() => onClose()} style={[styles.root, props.style]} />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    opacity: 0.7,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
