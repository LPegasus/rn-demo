import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import { useSearchCriteriaTip } from "../../hooks/useSearchCriteriaTip";
import { Avatar } from "../../components/Avatar";
import { SearchCriteria } from "./SearchPanel";
import { NavBar } from "../../components/NavBar";
import { useNavigation } from "@react-navigation/native";
import { CatLogo } from "../../components/CatLogo";
import { useMe } from "../Me/useMe";

export interface SearchBarPropsType {
  onSearchPress?(): void;
  onClearSearch?(): void;
  searchResult?: null | {
    searchCriteria: SearchCriteria | null;
    total: number;
  };
}

export function SearchBar(props: SearchBarPropsType) {
  const { onSearchPress, searchResult, onClearSearch } = props;
  const tip = useSearchCriteriaTip(
    searchResult?.searchCriteria || null,
    "result"
  );
  const userQuery = useMe();

  const navigation = useNavigation();

  return (
    <>
      <NavBar
        left={
          <TouchableOpacity activeOpacity={0.7} onPress={onSearchPress}>
            <Image
              style={styles.image}
              source={require("../../assets/imgs/icon/search.png")}
            />
          </TouchableOpacity>
        }
        center={<CatLogo />}
        right={
          <Pressable
            onPress={() => {
              navigation.navigate("Me");
            }}
          >
            <Avatar style={styles.avatar} url={userQuery.resp?.avatar} />
          </Pressable>
        }
      />
      {searchResult && (
        <View style={styles.searchResultRoot}>
          <View style={styles.searchResultLine1}>
            <Text style={styles.totalTip}>{searchResult.total} results</Text>
            <Pressable
              onPress={onClearSearch}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>clear search</Text>
              </View>
            </Pressable>
          </View>
          {tip && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.searchTip}
            >
              {tip}
            </Text>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchTip: {
    fontSize: 12,
    color: "#67616D",
    paddingLeft: 6,
    marginTop: 6,
  },
  searchResultLine1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalTip: {
    textTransform: "capitalize",
    color: "#8560A9",
    fontSize: 16,
    paddingLeft: 6,
  },
  clearBtn: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#D5EF7F",
  },
  clearBtnText: {
    color: "#67616D",
    textTransform: "uppercase",
    fontSize: 10,
  },
  searchResultRoot: {
    backgroundColor: "#FAF9FC",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  image: { width: 32, height: 32 },
  content: {
    height: 48,
    backgroundColor: "#8560A9",
    opacity: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
