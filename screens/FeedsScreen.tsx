import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  unstable_batchedUpdates,
} from "react-native";
import { MaskView } from "../components/MaskView";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedItemStructure, MemoizedFeedCard } from "./Feeds/FeedCard";
import { createFeedItemPagination } from "../constants/mock";
import { RootStackScreenProps } from "../types";
import { SearchBar } from "./Feeds/SearchBar";
import { from } from "rxjs";
import { EmptyResult } from "../components/EmptyResult";
import { SearchCriteria, SearchPanel } from "./Feeds/SearchPanel";
import React from "react";
import { useLayoutAnimateCallback } from "../hooks/useLayoutAnimate";

async function* fetchFeeds(p: number) {
  yield { type: "loading" };
  await new Promise((r) => setTimeout(r, 5000));
  yield { type: "result", feeds: createFeedItemPagination(p * 10 + 1) };
}

export function FeedsScreen(props: RootStackScreenProps<"Feeds">) {
  const [data, setData] = useState<FeedItemStructure[]>(
    createFeedItemPagination(0)
  );
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const windowSize = useWindowDimensions();

  const [searchResult, setSearchResult] = useState<{
    searchCriteria: SearchCriteria;
    total: number;
  } | null>({
    searchCriteria: {
      channel: "channel No.3",
      date: "THIS MONTH",
    },
    total: 14,
  });

  const handlePressLike = (item: FeedItemStructure) => {
    Alert.alert(item.channelName);
  };

  const triggerLoadMore = () => {
    setPageIndex((p) => p + 1);
  };

  const handlePressGoing = (item: FeedItemStructure) => {
    Alert.alert(item.channelName);
  };

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const handleClearSearch = useLayoutAnimateCallback(() => {
    setSearchResult(null);
  });

  useEffect(() => {
    if (pageIndex === 0) {
      return;
    }
    const sub = from(fetchFeeds(pageIndex)).subscribe((action) => {
      switch (action.type) {
        case "loading":
          setLoading(true);
          break;
        case "result":
          unstable_batchedUpdates(() => {
            setLoading(false);
            setData((d) => [...d, ...action.feeds!]);
          });
          break;
      }
    });
    return sub.unsubscribe.bind(sub);
  }, [pageIndex]);

  useEffect(() => {
    /** Refreshing list, clear old data */
    if (!refreshing) {
      return;
    }
    unstable_batchedUpdates(() => {
      setLoading(false);
      setData([]);
      setPageIndex(1);
    });
  }, [refreshing]);
  return (
    <SafeAreaView>
      <SearchPanel
        show={showSearchPanel}
        onSearchPress={(searchCriteria: SearchCriteria) => {
          console.log(searchCriteria);
        }}
      />

      <FlatList
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <SearchBar
            onSearchPress={() => setShowSearchPanel(true)}
            searchResult={searchResult}
            onClearSearch={handleClearSearch}
          />
        }
        onEndReached={triggerLoadMore}
        keyExtractor={(item) => String(item.id)}
        data={data}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.5}
        initialNumToRender={5}
        ListEmptyComponent={
          refreshing || loading ? null : (
            <View
              style={{
                height: windowSize.height / 2,
                justifyContent: "flex-end",
              }}
            >
              <EmptyResult />
            </View>
          )
        }
        ListFooterComponent={() => {
          return (
            <View
              style={{
                paddingVertical: 6,
                backgroundColor: "rgba(0,0,0,0.05)",
              }}
            >
              {!loading || refreshing ? (
                <Text style={{ color: "#AC8EC9", textAlign: "center" }}>
                  No more activity.
                </Text>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          );
        }}
        renderItem={({ item, index }) => {
          return (
            <MemoizedFeedCard
              item={item}
              onPressLike={handlePressLike}
              onPressGoing={handlePressGoing}
            />
          );
        }}
      />
      <MaskView
        visible={showSearchPanel}
        onClose={() => {
          setShowSearchPanel(false);
        }}
      />
    </SafeAreaView>
  );
}
