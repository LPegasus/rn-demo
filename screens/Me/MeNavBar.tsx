import { NavBar } from "../../components/NavBar";
import { CatLogo } from "../../components/CatLogo";
import { Avatar } from "../../components/Avatar";
import { Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function MeNavBar() {
  const navigation = useNavigation();

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
            source={require("../../assets/imgs/icon/home.png")}
          />
        </Pressable>
      }
      center={<CatLogo />}
      right={<Avatar style={styles.image} />}
    />
  );
}

const styles = StyleSheet.create({
  image: { width: 32, height: 32 },
});
