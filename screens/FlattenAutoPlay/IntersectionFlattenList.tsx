import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Text,
  View,
  ViewStyle,
  ViewToken,
} from "react-native";
import {
  concatWith,
  BehaviorSubject,
  concat,
  from,
  map,
  mergeAll,
  of,
  share,
  Subject,
  switchMap,
  tap,
  throttleTime,
  take,
  filter,
  distinctUntilChanged,
} from "rxjs";
// import { viewabilityConfig } from "./handleViewableItemsChanged";
import { IntersectionView } from "./IntersectionView";
import {
  StreamContext,
  createViewableItemsChangedStream,
  UnpackContextValueType,
  CardPos,
  ItemType,
} from "./stream";

const blockStyle: ViewStyle = {
  backgroundColor: "#f50",
  height: 300,
  width: "50%",
};

const videoStyle: ViewStyle = {
  flexGrow: 1,
  margin: 5,
  backgroundColor: "#eee",
};

const rootStyle: ViewStyle = {
  backgroundColor: "#000",
  paddingHorizontal: 16,
  position: "relative",
  flex: 1,
};

const InternalMemoBlock = memo(
  (props: { item: ItemType }) => {
    const { item } = props;
    return (
      <View style={blockStyle} key={item.id}>
        <View style={videoStyle}>
          <View>
            <Text>idx = {item.id}</Text>
          </View>
          <IntersectionView id={item.id} type={item.type} dur={item.dur} />
        </View>
      </View>
    );
  },
  (p1, p2) => p1.item === p2.item
);

function ListRenderItem(props: ListRenderItemInfo<ItemType>) {
  const { item, separators, index } = props;
  return <InternalMemoBlock item={item} />;
}

export function IntersectionFlatList() {
  const lineRef = useRef<View>(null);
  const activeIdsChangeSubject = useState(
    () => new BehaviorSubject([] as string[])
  )[0];
  const playingSubject = useState(
    () =>
      new BehaviorSubject<{ id: string; type: "start" | "end" } | null>(null)
  )[0];
  const lineY = useRef(0);
  const [halfHeight, setHalfHeight] = useState(0);
  const viewableChangeSubject = useState(createViewableItemsChangedStream)[0];
  const scrollSubject = useState(() => new Subject<void>())[0];
  const cardLayoutSubject = useState(() => new Subject<CardPos>())[0];
  const [videoPlayEndSubject] = useState(() => new Subject<ItemType["id"]>());
  const handleViewableItemsChanged = useCallback(
    (param: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      viewableChangeSubject.next(param);
    },
    [viewableChangeSubject]
  );

  /** 维护那些 item 在可见区域 */
  const itemsInView = useState(
    () => new Map<string, null | Omit<CardPos, "id">>()
  )[0];

  const viewableChanged$ = useState(() => {
    return viewableChangeSubject.pipe(
      map((d) => {
        return from(d.changed);
      }),
      mergeAll()
    );
  })[0];
  const data = useMemo(
    () =>
      Array.from({ length: 100 }).map((_, i) => {
        const type = Math.random() > 0.7 ? "img" : "video";
        return {
          id: String(i),
          type,
          dur: type === "img" ? 0 : Math.max(2000, (5000 * Math.random()) & -1),
        } as ItemType;
      }),
    []
  );

  const dataInMap = useMemo(() => {
    return data.reduce((acc, cur) => {
      acc.set(cur.id, cur);
      return acc;
    }, new Map<string, ItemType>());
  }, [data]);

  useEffect(() => {
    return () => {
      viewableChangeSubject.complete();
      cardLayoutSubject.complete();
    };
  }, [viewableChangeSubject]);

  /** 处理 viewable change 时，更新 itemsInView */
  useEffect(() => {
    const sub = viewableChanged$.subscribe((v) => {
      if (v.isViewable) {
        itemsInView.set(v.item.id, null);
      } else {
        itemsInView.delete(v.item.id);
      }
    });
    return () => sub.unsubscribe();
  }, [viewableChanged$]);

  useEffect(() => {
    lineRef.current?.measureInWindow((_, y) => {
      lineY.current = y;
    });
  }, [halfHeight]);

  useEffect(() => {
    const activeIds$ = cardLayoutSubject.pipe(
      tap((layoutWithId) => {
        const { id, ...pos } = layoutWithId;
        if (itemsInView.has(id)) {
          itemsInView.set(id, pos);
        }
      }),
      // throttleTime(100, undefined, { leading: false, trailing: true }),
      map(() => {
        let activeItemDistance: { id: string; deltaY: number } = {
          id: "",
          deltaY: Number.MAX_VALUE,
        };
        let activeIds: string[] = [];
        let hasIntersect = false;
        const baseY = lineY.current;

        for (const [k, v] of itemsInView) {
          if (!v) {
            continue;
          }
          if (v.y <= baseY && v.y + v.height >= baseY) {
            if (!hasIntersect) {
              activeIds = [];
              hasIntersect = true;
            }
            activeIds.push(k);
            continue;
          }
          if (hasIntersect) {
            continue;
          }

          const dist = Math.min(
            Math.abs(v.y - baseY),
            Math.abs(v.y + v.height - baseY)
          );

          if (activeItemDistance.deltaY === dist) {
            activeIds.push(k);
          } else if (activeItemDistance.deltaY < dist) {
            continue;
          } else {
            activeItemDistance = { id: k, deltaY: dist };
            activeIds = [k];
          }
        }
        return activeIds;
      }),
      filter((d) => d.length === 2),
      distinctUntilChanged((p1, p2) => p1.join(",") === p2.join(",")),
      throttleTime(300, undefined, { trailing: true }),
      share()
    );
    const sub = activeIds$.subscribe(activeIdsChangeSubject);

    let currentPlayingId = "";
    const playSubscription = activeIds$
      .pipe(
        switchMap((activeIds) => {
          const idsInView = Array.from(itemsInView.keys()).sort(
            (a, b) => Number(a) - Number(b)
          );
          let startIndex = -1;
          if (activeIds.includes(currentPlayingId)) {
            // 处理变为 highlight 位置的视频如果正在播放的情况，以当前正在播放的视频为带播放视频列表的第一个视频
            startIndex = idsInView.findIndex((k) => k === currentPlayingId);
          } else {
            // 如果正在播放的视频不在新的 highlight 位置，则切换到 highlight 位置的第一个视频
            startIndex = idsInView.findIndex((k) => activeIds.includes(k));
          }
          const idsAfterActive = idsInView.slice(startIndex); // Filter all ids after the first active id
          const videosToPlay = idsAfterActive.filter(
            (k) => dataInMap.get(k)?.type === "video"
          );
          return concat(
            ...videosToPlay.map((id) => {
              return of({ id, type: "start" as const }).pipe(
                tap((d) => {
                  currentPlayingId = d.id;
                }),
                concatWith(
                  videoPlayEndSubject.pipe(
                    filter((d) => d === id),
                    tap((d) => {
                      currentPlayingId = "";
                    }),
                    take(1),
                    map((id) => {
                      return { id, type: "end" as const };
                    })
                  )
                )
              );
            })
          );
        })
      )
      .subscribe(playingSubject);
    return () => {
      sub.unsubscribe();
      playSubscription.unsubscribe();
    };
  }, [cardLayoutSubject, halfHeight, data, dataInMap, playingSubject]);

  const ctxValue = useMemo<UnpackContextValueType<typeof StreamContext>>(() => {
    return {
      changed$: viewableChanged$,
      reportLayout: (v, id) => {
        v.measureInWindow((...args) => {
          const [x, y, width, height] = args.map(Math.round);
          cardLayoutSubject.next({ x, y, width, height, id });
        });
      },
      scroll$: scrollSubject.asObservable(),
      activeIdsChange$: activeIdsChangeSubject.asObservable(),
      playingId$: playingSubject
        .asObservable()
        .pipe(
          distinctUntilChanged(
            (prev, cur) => prev?.id === cur?.id && prev?.type === cur?.type
          )
        ),
      handleVideoPlayEnd: (id) => videoPlayEndSubject.next(id),
    };
  }, [viewableChanged$]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollSubject.next();
    },
    []
  );

  return (
    <StreamContext.Provider value={ctxValue}>
      <View style={{ flex: 1 }}>
        <FlatList
          onLayout={(e) => setHalfHeight(e.nativeEvent.layout.height / 2)}
          numColumns={2}
          onScroll={handleScroll}
          onViewableItemsChanged={handleViewableItemsChanged}
          maxToRenderPerBatch={20}
          style={rootStyle}
          horizontal={false}
          data={data}
          renderItem={ListRenderItem}
        />
        <View
          ref={lineRef}
          style={{
            zIndex: 1,
            height: 1,
            width: "100%",
            backgroundColor: "#f50",
            position: "absolute",
            top: halfHeight,
          }}
        />
      </View>
    </StreamContext.Provider>
  );
}
