import { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

export interface ResponsiveBoxPropsType {
  percentByWidth: number;
  style?: ViewStyle;
  children?: JSX.Element | null;
  roundBorder?: boolean;
}

export function ResponsiveBox(props: ResponsiveBoxPropsType) {
  const { width } = useWindowDimensions();
  const { roundBorder, children = null, style, percentByWidth } = props;
  const w = width * percentByWidth;

  return (
    <View
      style={[
        styles.root,
        {
          minWidth: w,
          minHeight: w,
          maxWidth: w,
          maxHeight: w,
        },
        style,
        roundBorder && { borderRadius: (w / 2) & -1 },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
});
