import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  StyleSheet,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonNavBar } from "../components/CommonNavBar";
import { Comment } from "../api/interface";
import { DetailHeader } from "./Detail/DetailHeader";
import { DetailPresentation } from "./Detail/DetailPresentation";
import { DetailActionBlock } from "./Detail/DetailActionBlock";
import { EventInteractiveActionBar } from "./Detail/EventInteractiveActionBar";
import { useCallback, useMemo, useRef, useState } from "react";
import { Separator } from "../components/Separator";
import { EventDate } from "./Detail/EventDate";
import { EventLocation } from "./Detail/EventLocation";
import { EventLikedAndGoingBlock } from "./Detail/EventLikedAndGoingBlock";
import { CommentCard } from "./Comment/CommentCard";
import { useCommentList } from "./Comment/useCommentList";
import { CommentInput } from "./Comment/CommentInput";
import { useEventDetail } from "./Detail/useEventDetail";
import { useLayoutAnimateCallback } from "../hooks/useLayoutAnimate";
import { Subject } from "rxjs";
import { useFavoriteToggle } from "./Detail/useFavoriteToggle";
import { useJoinToggle } from "./Detail/useJoinToggle";

export function EventDetailScreen() {
  const [actionType, setActionType] = useState<
    "Details" | "Comments" | "Participants"
  >("Details");
  const listRef = useRef<FlatList>(null);
  const [showReplay, _setShowReplay] = useState(false);
  const setShowReplay = useLayoutAnimateCallback(_setShowReplay);
  const [replayContent, setReplayContent] = useState("");

  const eventDetailQuery = useEventDetail(2);
  const event = eventDetailQuery.resp?.event;

  /** flags to control async method, these flags do not have direct render effects. */
  const controlFlag = useRef({
    firstCommentIndex: 0,
    participantsIndex: 7,
    stopListenViewableChange: false,
    eventChangeOrUnmount$: new Subject(),
  });

  const handleReplayPress = useCallback((comment: Comment) => {
    setShowReplay(true);
    setReplayContent("@" + comment.user.username + " ");
  }, []);

  /**
   * This memoizedState will have the save effect of using React.memo to wrap component.
   * And useMemo has better perf.
   */
  const partialEventElements = useMemo(() => {
    if (!event) {
      return [];
    }
    return [
      <DetailHeader key="DetailHeader" event={event} />,
      <DetailPresentation key="DetailPresentation" event={event} />,
      <Separator key="Separator0" />,
      <EventDate key="EventDate" event={event} />,
      <Separator key="Separator1" />,
      <EventLocation key="EventLocation" event={event} />,
      <EventLikedAndGoingBlock key="EventLikedAndGoingBlock" event={event} />,
    ];
  }, [event]);

  const actionBlockElement = useMemo(() => {
    return (
      <DetailActionBlock
        selectedAction={actionType}
        onActionTypeChange={(t: "Details" | "Comments" | "Participants") => {
          /**
           * Can't scroll by useEffect for actionType has two ways to change.
           * One is by user scroll the view.
           * Another is by user press the action button.
           */
          scrollByActionType(t);
          setActionType(t);
        }}
      />
    );
  }, [actionType]);

  const commentList = useCommentList(event?.id);

  const comments = useMemo<
    Array<{ isFirst: boolean; type: "comment"; comment: Comment }>
  >(() => {
    return (
      commentList.data?.comments.map((comment, i) => {
        return { type: "comment", comment, isFirst: i === 0 };
      }) || []
    );
  }, [commentList.data]);

  const flatListData = useMemo(() => {
    const list = [...partialEventElements, ...comments];
    list.splice(1, 0, actionBlockElement);
    return list;
  }, [actionBlockElement, partialEventElements, comments]);

  const handleCommentSubmit = () => {
    setShowReplay(false);
  };

  const scrollByActionType = useCallback(
    (t: "Details" | "Comments" | "Participants") => {
      const scrollView = listRef.current;
      if (!scrollView) {
        return;
      }
      switch (t) {
        case "Details":
          scrollView.scrollToIndex({
            index: 2,
            animated: true,
          });
          controlFlag.current.stopListenViewableChange = true;
          break;
        case "Comments":
          scrollView.scrollToIndex({
            index: controlFlag.current.firstCommentIndex,
            viewOffset: 48,
            animated: true,
          });
          controlFlag.current.stopListenViewableChange = true;
          break;
        case "Participants":
          scrollView.scrollToIndex({
            index: controlFlag.current.participantsIndex,
            viewOffset: 48,
            animated: true,
          });
          controlFlag.current.stopListenViewableChange = true;
          break;
      }
    },
    []
  );

  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (controlFlag.current.stopListenViewableChange) {
        return;
      }
      const commentViewToken = viewableItems.find(
        (d) => d.item.type === "comment" && d.item.isFirst
      );
      const participantViewToken = viewableItems.find(
        (d) => d.item.key === "EventLikedAndGoingBlock"
      );
      const detailViewToken = viewableItems.find((d) => d.index === 2);
      if (detailViewToken) {
        setActionType("Details");
      } else if (participantViewToken) {
        setActionType("Participants");
      } else if (commentViewToken) {
        setActionType("Comments");
      }
    },
    []
  );

  const handleFavoritePress = useFavoriteToggle(
    event,
    controlFlag.current.eventChangeOrUnmount$,
    eventDetailQuery
  );

  const handleJoinPress = useJoinToggle(
    event,
    controlFlag.current.eventChangeOrUnmount$,
    eventDetailQuery
  );

  if (!event) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <CommonNavBar />
      <FlatList
        onScrollAnimationEnd={() =>
          (controlFlag.current.stopListenViewableChange = false)
        }
        onViewableItemsChanged={handleViewableItemsChanged}
        style={{ backgroundColor: "#FAF9FC", flex: 1 }}
        ref={listRef}
        stickyHeaderIndices={[1]}
        data={flatListData}
        renderItem={({ index, item }) => {
          if (item.type === "comment") {
            if (item.isFirst) {
              controlFlag.current.firstCommentIndex = index;
            }
            return (
              <View style={styles.commentCard} key={item.comment.id}>
                <CommentCard
                  comment={item.comment}
                  onReplyPress={handleReplayPress}
                />
              </View>
            );
          }
          return item;
        }}
        onEndReached={commentList.loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => {
          return (
            <View
              style={{
                paddingVertical: 6,
                backgroundColor: "rgba(0,0,0,0.05)",
              }}
            >
              {!commentList.data?.hasMore ? (
                <Text style={{ color: "#AC8EC9", textAlign: "center" }}>
                  No more comment.
                </Text>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          );
        }}
      />
      <EventInteractiveActionBar
        onCommentPress={() => {
          setShowReplay(true);
        }}
        onFavoritePress={handleFavoritePress}
        onJoinPress={handleJoinPress}
        event={event}
      />
      {showReplay && (
        <View style={styles.commentRoot}>
          <CommentInput
            placeholder={replayContent}
            eventId={event.id}
            onSubmitSuccess={handleCommentSubmit}
            onClose={() => {
              setShowReplay((s) => !s);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  commentCard: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  commentRoot: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 4,
  },
  root: { minHeight: "100%", position: "relative" },
});
