import { useRef, useState } from "react";
import { View, ScrollView, Image, Pressable, StyleSheet } from "react-native";

export function ExpandableLine(props: {
  left: JSX.Element;
  right: JSX.Element;
  expand?: boolean;
  onExpand?: () => void;
}) {
  const { onExpand, left, right, expand = false } = props;
  const heightRef = useRef(0);
  const [needExpand, setNeedExpand] = useState(false);
  const measuredRef = useRef(false);

  return (
    <View style={wrapStyles.root}>
      <View style={wrapStyles.left}>{left}</View>
      <ScrollView
        scrollEnabled={false}
        directionalLockEnabled={true}
        collapsable={false}
        horizontal={false}
        style={{
          height: expand ? heightRef.current : 32,
          position: "relative",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={wrapStyles.right}
          onLayout={
            measuredRef.current
              ? undefined
              : (e) => {
                  heightRef.current = e.nativeEvent.layout.height;
                  setNeedExpand(heightRef.current > 34);
                }
          }
        >
          {right}
        </View>
        {needExpand && !expand && (
          <Pressable style={wrapStyles.expandBtn} onPress={onExpand}>
            <Image
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
              source={require("../../assets/imgs/icon/arrow-down.png")}
            />
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const wrapStyles = StyleSheet.create({
  expandBtn: {
    position: "absolute",
    right: 0,
    height: 32,
    width: 32,
    backgroundColor: "#FAF9FC",
    justifyContent: "center",
  },
  right: {
    flex: 1,
    flexShrink: 0,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  left: {
    height: 32,
    alignItems: "center",
    flexDirection: "row",
    flexBasis: 65,
    flexGrow: 0,
  },
  root: {
    position: "relative",
    padding: 12,
    flexDirection: "row",
  },
});
