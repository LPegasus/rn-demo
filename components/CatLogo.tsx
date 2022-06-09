import { View, Image } from "react-native";

export function CatLogo() {
  return (
    <View style={{ width: 32, overflow: "hidden" }}>
      <Image
        style={{ width: 32, height: 32 }}
        resizeMode="contain"
        source={require("../assets/imgs/cat/cat.png")}
      />
    </View>
  );
}
