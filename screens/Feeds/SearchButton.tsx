import { useEffect, useState } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Easing,
  Platform,
  UIManager,
} from "react-native";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export function SearchButton(props: {
  onPress?(): void;
  disabled?: boolean;
  tip?: string;
}) {
  const { onPress, disabled = false, tip = "" } = props;
  const opacityAnim = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: disabled ? 0 : 1,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [disabled]);

  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.root}>
      <Animated.View style={[styles.rootMask, { opacity: opacityAnim }]} />
      <View style={styles.line1}>
        <Image
          style={[styles.searchIcon, disabled && { opacity: 0.7 }]}
          source={require("../../assets/imgs/icon/search.png")}
        />
        <Text style={[styles.content, disabled && styles.contentDisabled]}>
          SEARCH
        </Text>
      </View>
      {Boolean(tip) && (
        <View style={styles.tipContainer}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={styles.tip}>
            {tip}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tipContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  tip: {
    fontSize: 10,
    color: "#8560A9",
    textAlign: "center",
  },
  root: {
    backgroundColor: "#BABABA",
    justifyContent: "center",
    alignItems: "center",
    height: 64,
  },
  rootMask: {
    backgroundColor: "#D5EF7F",
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
  },
  content: {
    fontSize: 16,
    color: "#453257",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  contentDisabled: { color: "#666666" },
  searchIcon: {
    top: 1,
    height: 16,
    width: 16,
    marginRight: 6,
  },
  line1: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
