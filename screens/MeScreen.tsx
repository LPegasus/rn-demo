import { ScrollView, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../components/Avatar";
import { CommonNavBar } from "../components/CommonNavBar";
import { MeActionsBlock, ActionType } from "./Me/MeActionsBlock";
import { ResponsiveBox } from "../components/ResponsiveBox";
import { useState } from "react";
import { MemoizedFeedCard, FeedItemStructure } from "./Feeds/FeedCard";
import { EmptyResult } from "../components/EmptyResult";
import { createFeedItemPagination } from "../constants/mock";

export function MeScreen() {
  const [actionType, setActionType] = useState<ActionType>("likes");
  const [feedsData, setFeedsData] = useState<FeedItemStructure[]>(
    createFeedItemPagination(0)
  );

  return (
    <SafeAreaView>
      <ScrollView
        stickyHeaderIndices={[0]}
        style={{ backgroundColor: "#fff", minHeight: "100%" }}
      >
        <CommonNavBar />
        <View style={styles.avatarRoot}>
          <ResponsiveBox
            roundBorder={true}
            percentByWidth={0.225}
            style={styles.avatarBorder}
          >
            <Avatar style={styles.avatar} />
          </ResponsiveBox>
        </View>
        <View>
          <Text style={styles.name}>Username</Text>
        </View>
        <View>
          <Text style={styles.email}>myusername@email.com</Text>
        </View>
        <View style={{ height: 24 }} />
        <MeActionsBlock
          onActionTypeChange={setActionType as any}
          selectedAction={actionType}
          count={{
            likes: 0,
            going: 0,
            past: 0,
          }}
        />
        {feedsData.length === 0 ? (
          <EmptyResult style={{ marginTop: 70 }} />
        ) : (
          feedsData.map((d) => {
            return (
              <MemoizedFeedCard
                key={String(d.id)}
                item={d}
                onPressGoing={() => {}}
                onPressLike={() => {}}
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatarRoot: {
    paddingTop: 36,
    paddingBottom: 24,
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
  },
  avatarBorder: {
    borderColor: "#8560A959",
    borderWidth: 3,
  },
  avatar: { width: "100%", height: "100%" },
  name: {
    color: "#67616D",
    fontSize: 24,
    textAlign: "center",
  },
  email: {
    color: "#8560A9",
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
  },
});
