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
  BehaviorSubject,
  bufferCount,
  bufferTime,
  debounceTime,
  from,
  map,
  mergeAll,
  Subject,
  tap,
  throttleTime,
} from "rxjs";
import { NavBar } from "../../components/NavBar";
import { viewabilityConfig } from "./handleViewableItemsChanged";
import { IntersectionView } from "./IntersectionView";
import {
  StreamContext,
  createViewableItemsChangedStream,
  UnpackContextValueType,
  CardPos,
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
  (props: { item: { id: string } }) => {
    const { item } = props;
    return (
      <View style={blockStyle} key={item.id}>
        <View style={videoStyle}>
          <View>
            <Text>idx = {item.id}</Text>
          </View>
          <View>
            <Text numberOfLines={3}>
              When i used FlatList in Android, when i first entered the page,
              why onViewableItemsChanged method does't trigger? Generally
              speaking, first render also means that the visibility of items
              have changed?
            </Text>
          </View>
          <IntersectionView id={item.id} />
        </View>
      </View>
    );
  },
  (p1, p2) => p1.item === p2.item
);

function ListRenderItem(props: ListRenderItemInfo<{ id: string }>) {
  const { item, separators, index } = props;
  return <InternalMemoBlock item={item} />;
}

export function IntersectionFlatList() {
  const ref = useRef<View>(null);
  const lineRef = useRef<View>(null);
  const activeIdsChangeSubject = useState(
    () => new BehaviorSubject([] as string[])
  )[0];
  const lineY = useRef(0);
  const [halfHeight, setHalfHeight] = useState(0);
  const viewableChangeSubject = useState(createViewableItemsChangedStream)[0];
  const scrollSubject = useState(() => new Subject<void>())[0];
  const cardLayoutSubject = useState(() => new Subject<CardPos>())[0];
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
    const sub = cardLayoutSubject
      .pipe(
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
          if (activeIds.length === 1) {
            console.log(itemsInView);
          }
          return activeIds;
        })
      )
      .pipe(throttleTime(300, undefined, { trailing: true }))
      .subscribe(activeIdsChangeSubject);
    return () => sub.unsubscribe();
  }, [cardLayoutSubject, halfHeight]);

  const data = useMemo(
    () => Array.from({ length: 100 }).map((_, i) => ({ id: String(i) })),
    []
  );

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
      <View ref={ref} style={{ flex: 1 }}>
        <FlatList
          onLayout={(e) => setHalfHeight(e.nativeEvent.layout.height / 2)}
          numColumns={2}
          onScroll={handleScroll}
          viewabilityConfig={viewabilityConfig}
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
