import { StyleSheet, View } from "react-native";
import { GetEventDetailResponseBody } from "../../api/interface";
import { ChannelTag } from "../../components/ChannelTag";
import { AuthorLabel } from "./AuthorLabel";
import { EventTitle } from "../../components/EventTitle";

export function DetailHeader({
  event,
}: {
  event: GetEventDetailResponseBody["event"];
}) {
  return (
    <View style={styles.root}>
      <View style={{ alignItems: "flex-start" }}>
        <ChannelTag>{event.channel.name}</ChannelTag>
      </View>
      <EventTitle>{event.name}</EventTitle>
      <View style={{ height: 24 }} />
      <View>
        <AuthorLabel creator={event.creator} createdAt={event.create_time} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    padding: 16,
  },
});
