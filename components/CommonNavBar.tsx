import { NavBar } from "./NavBar";
import { CatLogo } from "./CatLogo";
import { Avatar } from "./Avatar";
import { Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMe } from "../screens/Me/useMe";

export function CommonNavBar() {
  const navigation = useNavigation();
  const userQuery = useMe();

  return (
    <NavBar
      left={
        <Pressable
          onPress={() => {
            navigation.navigate("Feeds", {});
          }}
        >
          <Image
            style={{ width: 28, height: 28 }}
            source={require("../assets/imgs/icon/home.png")}
          />
        </Pressable>
      }
      center={<CatLogo />}
      right={
        <Pressable
          onPress={() => {
            navigation.navigate("Me");
          }}
        >
          <Avatar style={styles.image} url={userQuery.resp?.avatar} />
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  image: { width: 32, height: 32 },
});
