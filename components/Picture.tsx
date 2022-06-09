import { useScreenWidth } from "../hooks/useScreenWidth";
import { Image, StyleSheet, View } from "react-native";
import { useState } from "react";

export function Picture({ url }: { url: string }) {
  const width = useScreenWidth(0.5625);
  const height = useScreenWidth(0.3125);
  const [err, setErr] = useState<any>(false);

  return (
    <Image
      onError={() => {
        setErr(true);
      }}
      source={{ uri: url }}
      style={{
        display: err ? "none" : "flex",
        backgroundColor: "#F5F5F5",
        width,
        borderRadius: 8,
        marginLeft: 16,
        height,
      }}
      resizeMode="cover"
    />
  );
}
