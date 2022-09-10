import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  type ViewStyle,
  Image,
  Text,
  TouchableWithoutFeedback,
  type ImageStyle,
} from "react-native";
import {
  filter,
  switchMap,
  takeUntil,
  take,
  delay,
  concat,
  throttleTime,
  of,
  map,
} from "rxjs";
import { useObservable } from "../../hooks/useObservable";
import { ItemType, StreamContext } from "./stream";
import { Video } from "./Video";

const url1 = require("../../assets/imgs/ff7/Aerith1.png");
const url2 = require("../../assets/imgs/ff7/Aerith2.png");
const url3 = require("../../assets/imgs/ff7/Aerith3.png");
const url4 = require("../../assets/imgs/ff7/Aerith4.png");
const url5 = require("../../assets/imgs/ff7/Aerith5.png");
const url6 = require("../../assets/imgs/ff7/Aerith6.png");
const url7 = require("../../assets/imgs/ff7/Aerith7.png");
const url8 = require("../../assets/imgs/ff7/Aerith8.png");
const url9 = require("../../assets/imgs/ff7/Aerith9.png");
const url10 = require("../../assets/imgs/ff7/Aerith10.png");

const images = [url1, url2, url3, url4, url5, url6, url7, url8, url9, url10];

const rootStyle: ViewStyle = {
  backgroundColor: "#ddd",
  width: "100%",
};

const imageStyle: ImageStyle = {
  width: "100%",
  height: 150,
};

export function IntersectionView(props: ItemType) {
  const { id, type, dur } = props;
  const {
    changed$,
    reportLayout,
    scroll$,
    activeIdsChange$,
    handleVideoPlayEnd,
    playingId$,
  } = useContext(StreamContext);
  const changedMatch$ = useMemo(() => {
    return changed$.pipe(filter((d) => d.item.id === id));
  }, [id]);
  const [status, setStatus] = useState("inactive");
  const ref = useRef<View>(null);
  const playingAction = useObservable(playingId$, null);

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
        <Text>{type}</Text>
        <Text>{status}</Text>
        {type === "video" ? (
          <Video
            isPlaying={
              playingAction?.type === "start" && playingAction.id === id
            }
            dur={dur}
            onPlayEnd={useRef(() => handleVideoPlayEnd(id)).current}
          />
        ) : (
          <Image style={imageStyle} source={images[(Number(id) % 10) + 1]} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
