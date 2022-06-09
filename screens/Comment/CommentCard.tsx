import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Comment } from "../../api/interface";
import { Avatar } from "../../components/Avatar";
import { useTimeAgo } from "../../hooks/useTimeAgo";

export function CommentCard(props: {
  comment: Comment;
  style?: ViewStyle;
  onReplyPress?(comment: Comment): void;
}) {
  const { comment, onReplyPress, style } = props;
  const timeAgo = useTimeAgo(comment.createdAt);

  return (
    <View style={[styles.root, style]}>
      <View style={styles.left}>
        <Avatar style={{ width: 32, height: 32 }} url={comment.user.avatar} />
      </View>
      <View style={styles.name}>
        <View style={styles.line}>
          <Text style={{ fontSize: 12, color: "#8560A9" }}>
            {comment.user.username}
          </Text>
          <Text style={{ marginLeft: 12, fontSize: 10, color: "#BABABA" }}>
            {timeAgo}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onReplyPress?.(comment)}
        >
          <Image
            style={{ width: 16, height: 16, marginRight: 4 }}
            resizeMode="contain"
            source={require("../../assets/imgs/icon/reply.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={{ fontSize: 14, color: "#67616D" }}>
          {comment.comment}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingLeft: 44, position: "relative" },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    justifyContent: "flex-start",
    position: "absolute",
    left: 0,
    alignItems: "center",
    minWidth: 32,
    maxWidth: 32,
  },
  right: { paddingLeft: 44 },
  name: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  content: {
    paddingTop: 4,
  },
});
