import React, { useState } from "react";
import { LayoutRectangle, StyleSheet } from "react-native";
import { View, Image, Text } from "react-native";
import { GetEventLikesMock, GetEventParticipantsMock } from "../../api";
import { GetEventDetailResponseBody } from "../../api/interface";
import { Avatar } from "../../components/Avatar";
import { Separator } from "../../components/Separator";
import { useFetchData } from "../../hooks/useFetchData";
import { useLayoutAnimateCallback } from "../../hooks/useLayoutAnimate";
import { ExpandableLine } from "./ExpandableLine";

export function EventLikedAndGoingBlock(props: {
  event: GetEventDetailResponseBody["event"];
  onLayout?: (e: { nativeEvent: { layout: LayoutRectangle } }) => void;
}) {
  const { event } = props;
  const participantsQuery = useFetchData(GetEventParticipantsMock, [event.id]);
  const likesQuery = useFetchData(GetEventLikesMock, [
    event.id,
    { offset: 0, limit: 100 },
  ]);
  const participants = participantsQuery.resp?.users;
  const likers = likesQuery.resp?.users;
  const [expand, _setExpand] = useState(false);
  const [expand2, _setExpand2] = useState(false);
  const setExpand = useLayoutAnimateCallback(_setExpand);
  const setExpand2 = useLayoutAnimateCallback(_setExpand2);

  return (
    <View
      onLayout={props.onLayout}
      style={{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#E8E8E8",
      }}
    >
      <ExpandableLine
        expand={expand}
        onExpand={() => {
          setExpand(true);
        }}
        left={
          <>
            <Image
              source={require("../../assets/imgs/icon/right-blank.png")}
              style={{ width: 12, height: 12 }}
            />
            <Text style={styles.label}>{event.goings_count} going</Text>
          </>
        }
        right={
          <>
            {participants?.length &&
              participants.map((user, i) => {
                return (
                  <View key={i.toString()} style={styles.imgWrap}>
                    <Avatar style={styles.img} url={user.avatar} />
                  </View>
                );
              })}
          </>
        }
      />
      <Separator />
      <ExpandableLine
        expand={expand2}
        onExpand={() => {
          setExpand2(true);
        }}
        left={
          <>
            <Image
              source={require("../../assets/imgs/icon/fav-blank.png")}
              style={{ width: 12, height: 12 }}
            />
            <Text style={styles.label}>{event.likes_count} likes</Text>
          </>
        }
        right={
          <>
            {likers?.length &&
              likers.map((user, i) => {
                return (
                  <View key={i.toString()} style={styles.imgWrap}>
                    <Avatar style={styles.img} url={user.avatar} />
                  </View>
                );
              })}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imgWrap: {
    height: 32,
    width: 32,
    justifyContent: "center",
  },
  img: {
    height: 24,
    width: 24,
    marginLeft: 8,
    borderRadius: 12,
  },
  label: {
    marginLeft: 5,
    fontSize: 12,
    color: "#67616D",
    height: 24,
    textAlignVertical: "center",
  },
});
