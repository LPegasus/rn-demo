import React from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Avatar } from "../../components/Avatar";
import { ChannelTag } from "../../components/ChannelTag";
import { EventTitle } from "../../components/EventTitle";

export interface FeedCardPropsType {
  item: FeedItemStructure;
  style?: ViewStyle;
  onPressGoing(item: FeedItemStructure): void;
  onPressLike(item: FeedItemStructure): void;
}

export interface FeedItemStructure {
  id: number;
  username: string;
  title: string;
  timeRange: string;
  content: string;
  going: boolean;
  goingCount: number;
  liking: boolean;
  likingCount: number;
  channelName: string;
  avatarUrl: string;
}

const styles = StyleSheet.create({
  root: {
    paddingLeft: 16,
    paddingTop: 16,
  },
  content: {
    paddingRight: 16,
    borderBottomColor: "#E8E8E8",
    paddingBottom: 14,
    display: "flex",
    borderBottomWidth: 1,
    justifyContent: "flex-start",
    flexDirection: "column",
  },
});

export function FeedCard(props: FeedCardPropsType) {
  const { onPressGoing, onPressLike, style, item } = props;
  return (
    <View style={[styles.root, style]}>
      <View style={styles.content}>
        <Author {...props.item} />
        <EventTitle>{props.item.title}</EventTitle>
        <TimeRange timeRange={props.item.timeRange} />
        <Content content={props.item.content} />

        <Interaction
          onPressLike={() => onPressLike(item)}
          onPressGoing={() => onPressGoing(item)}
          item={props.item}
        />
      </View>
    </View>
  );
}

export const MemoizedFeedCard = React.memo(
  FeedCard,
  (p1, p2) => p1.style === p2.style
);

function Author(props: {
  channelName: string;
  username: string;
  avatarUrl: string;
}) {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          maxWidth: "50%",
        }}
      >
        <Avatar url={props.avatarUrl} />
        <View style={{ marginLeft: 8 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "#67616D", fontSize: 12 }}
          >
            {props.username}
          </Text>
        </View>
      </View>
      <ChannelTag onPress={() => {}}>{props.channelName}</ChannelTag>
    </View>
  );
}

function TimeRange(props: { timeRange: string }) {
  return (
    <View style={{ paddingTop: 8, flexDirection: "row", alignItems: "center" }}>
      <Image
        width={12}
        height={12}
        source={require("../../assets/imgs/icon/clock.png")}
      />
      <Text
        style={{
          marginLeft: 5,
          color: "#8560A9",
          fontSize: 12,
        }}
      >
        {props.timeRange}
      </Text>
    </View>
  );
}

function Content(props: { content: string }) {
  return (
    <View>
      <Text
        style={{
          lineHeight: 18,
          fontSize: 14,
          color: "#67616D",
          paddingTop: 12,
        }}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {props.content}
      </Text>
    </View>
  );
}

function Interaction(props: {
  item: FeedItemStructure;
  onPressGoing(): void;
  onPressLike(): void;
}) {
  const { item, onPressGoing, onPressLike } = props;

  return (
    <View
      style={{
        left: -4,
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
    >
      <Going item={item} onPress={onPressGoing} />
      <View style={{ width: 30 }} />
      <Liking item={item} onPress={onPressLike} />
    </View>
  );
}

function Going(props: { item: FeedItemStructure; onPress(): void }) {
  const { item, onPress } = props;

  return (
    <TouchableHighlight onPress={onPress}>
      <View
        style={{
          padding: 4,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {item.going ? (
          <>
            <Image
              style={{ width: 12, height: 12 }}
              source={require("../../assets/imgs/icon/right.png")}
            />
            <Text style={{ marginLeft: 5, color: "#453257" }}>I am going!</Text>
          </>
        ) : (
          <>
            <Image
              style={{ width: 12, height: 12 }}
              source={require("../../assets/imgs/icon/right-blank.png")}
            />
            <Text style={{ fontSize: 12, marginLeft: 5, color: "#AC8EC9" }}>
              {item.goingCount} Going
            </Text>
          </>
        )}
      </View>
    </TouchableHighlight>
  );
}

function Liking(props: { item: FeedItemStructure; onPress(): void }) {
  const { item, onPress } = props;
  return (
    <TouchableHighlight onPress={onPress}>
      <View
        style={{
          padding: 4,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {item.liking ? (
          <>
            <Image
              style={{ width: 12, height: 12 }}
              source={require("../../assets/imgs/icon/fav.png")}
            />
            <Text style={{ marginLeft: 5, color: "#453257" }}>I like it</Text>
          </>
        ) : (
          <>
            <Image
              style={{ width: 12, height: 12 }}
              source={require("../../assets/imgs/icon/fav-blank.png")}
            />
            <Text style={{ fontSize: 12, marginLeft: 5, color: "#AC8EC9" }}>
              {item.likingCount} Likes
            </Text>
          </>
        )}
      </View>
    </TouchableHighlight>
  );
}
