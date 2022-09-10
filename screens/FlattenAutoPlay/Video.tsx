import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Easing, Text, Animated, View, ViewStyle } from "react-native";

const rootStyle: ViewStyle = {
  backgroundColor: "#111",
  width: "100%",
  height: 150,
  position: "relative",
};

const progressBarStyle: ViewStyle = {
  backgroundColor: "rgba(255,255,255,0.7)",
  height: 10,
  width: "100%",
};

export function Video(props: {
  dur: number;
  isPlaying?: boolean;
  onPlayEnd?(): void;
}) {
  const { dur, isPlaying, onPlayEnd = () => {} } = props;
  const [scaleXAnim] = useState(() => new Animated.Value(0));
  const [playEnd, setPlayEnd] = useState(false);
  const onPlayEndEvent = useRef(onPlayEnd);

  useLayoutEffect(() => {
    onPlayEndEvent.current = onPlayEnd;
  }, [onPlayEnd]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const anim = Animated.timing(scaleXAnim, {
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
      easing: Easing.linear,
      duration: dur,
    });
    anim.start();
    scaleXAnim.addListener(({ value }) => {
      if (value === 1) {
        setPlayEnd(true);
      }
    });
    return () => {
      anim.reset();
      setPlayEnd(false);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (playEnd) {
      onPlayEndEvent.current?.();
    }
  }, [playEnd, onPlayEndEvent]);

  return (
    <View style={rootStyle}>
      <Animated.View
        style={[
          progressBarStyle,
          {
            transform: [
              {
                scaleX: scaleXAnim,
              },
            ],
          },
        ]}
      />
      <View>
        <Text style={{ color: "#fff" }}>
          {playEnd ? "Play End" : isPlaying ? "Playing" : ""}
        </Text>
      </View>
    </View>
  );
}
