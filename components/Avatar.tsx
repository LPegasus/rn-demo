import React, { useState } from "react";
import { ImageBackground, StyleProp, ViewStyle } from "react-native";

const defaultAvatar = require("../assets/imgs/icon/default-account.png");

export function Avatar(props: { url?: string; style?: StyleProp<ViewStyle> }) {
  const { url, style } = props;
  const [loadErr, setLoadErr] = useState(false);

  return (
    <ImageBackground
      style={[
        {
          overflow: "hidden",
          borderRadius: 10,
          minHeight: 20,
          minWidth: 20,
        },
        style,
      ]}
      onError={() => {
        setLoadErr(true);
      }}
      source={url && !loadErr ? { uri: url } : defaultAvatar}
    />
  );
}
