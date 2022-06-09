import { useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GetEventDetailResponseBody } from "../../api/interface";
import { Avatar } from "../../components/Avatar";

export interface AuthorLabelPropsType {
  creator: GetEventDetailResponseBody["creator"];
  createdAt: GetEventDetailResponseBody["create_time"];
}

export function AuthorLabel(props: AuthorLabelPropsType) {
  const { creator, createdAt } = props;
  const date = useMemo(() => {
    // TODO: convert to time ago
    const d = new Date(createdAt);
    return [
      String(d.getDate()),
      String(d.getMonth() + 1),
      String(d.getFullYear()),
    ].join("/");
  }, [createdAt]);

  return (
    <View style={styles.root}>
      <Avatar url={creator.avatar} style={{ width: 36, height: 36 }} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 14, color: "#67616D" }}>
          {creator.username}
        </Text>
        <Text style={{ fontSize: 12, color: "#BABABA" }}>
          Published at {date}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 36,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
});
