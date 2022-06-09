import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GetEventDetailResponseBody } from "../../api/interface";

export interface EventInteractiveActionBarPropsType {
  onCommentPress?(): void;
  onFavoritePress?(): void;
  onJoinPress?(): void;
  event: GetEventDetailResponseBody["event"];
}

export function EventInteractiveActionBar(
  props: EventInteractiveActionBarPropsType
) {
  const { onCommentPress, onFavoritePress, onJoinPress, event } = props;
  const hasJoined = event.me_going;
  const hasLiked = event.me_likes;

  return (
    <View style={styles.root}>
      <View style={styles.btn1}>
        <TouchableOpacity onPress={onCommentPress}>
          <Image
            style={styles.img}
            source={require("../../assets/imgs/icon/comment2.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onFavoritePress}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={
              hasLiked
                ? require("../../assets/imgs/icon/green-fav.png")
                : require("../../assets/imgs/icon/fav-dark.png")
            }
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.btn2}
        activeOpacity={0.9}
        onPress={onJoinPress}
      >
        <Image
          style={styles.img}
          source={
            !hasJoined
              ? require("../../assets/imgs/icon/right-green.png")
              : require("../../assets/imgs/icon/right-joined.png")
          }
        />
        <Text
          style={[
            styles.join,
            hasJoined && { color: "#8560A9", fontWeight: "700" },
          ]}
        >
          {hasJoined ? "I am going" : "Join"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 56,
    flexDirection: "row",
  },
  img: {
    width: 24,
    height: 24,
  },
  btn1: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#8560A9",
    flexBasis: "56.25%",
  },
  btn2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D5EF7F",
    flex: 1,
  },
  join: {
    marginLeft: 12,
    fontWeight: "700",
    color: "#788C36",
    fontSize: 14,
  },
});
