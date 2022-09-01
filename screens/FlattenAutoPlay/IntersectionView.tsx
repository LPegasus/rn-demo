import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  type ViewStyle,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import {
  filter,
  switchMap,
  takeUntil,
  Observable,
  take,
  delay,
  concat,
  throttleTime,
  tap,
  of,
  map,
} from "rxjs";
import { StreamContext } from "./stream";

const rootStyle: ViewStyle = {
  height: 100,
  width: 100,
  backgroundColor: "#ddd",
};

export function IntersectionView(props: { id: string }) {
  const { id } = props;
  const { changed$, reportLayout, scroll$, activeIdsChange$ } =
    useContext(StreamContext);
  const changedMatch$ = useMemo(() => {
    return changed$.pipe(filter((d) => d.item.id === id));
  }, [id]);
  const [status, setStatus] = useState("inactive");
  const ref = useRef<View>(null);

  useEffect(() => {
    const sub = activeIdsChange$
      .pipe(
        map((ids) => {
          return ids.includes(id) ? "active" : "inactive";
        })
      )
      .subscribe(setStatus);

    return () => sub.unsubscribe();
  }, [id]);

  useEffect(() => {
    const enter$ = changedMatch$.pipe(filter((d) => d.isViewable));
    const leave$ = changedMatch$.pipe(filter((d) => !d.isViewable));
    const sub = enter$
      .pipe(
        switchMap((_view) => {
          return concat(
            of(null).pipe(take(1), delay(500)),
            scroll$.pipe(
              throttleTime(50, undefined, { trailing: true, leading: false })
            )
          ).pipe(
            takeUntil(leave$),
            map(() => ref.current),
            filter(Boolean)
          );
        })
      )
      .subscribe((v) => reportLayout(v, id));
    return () => sub.unsubscribe();
  }, [changed$, id, scroll$]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        ref.current?.measureInWindow(console.log);
      }}
    >
      <View
        style={[
          rootStyle,
          status === "active" && { backgroundColor: "#008ED4" },
        ]}
        ref={ref}
      >
        <Text>{status}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
