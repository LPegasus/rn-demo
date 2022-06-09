import { useDebugValue, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Animated,
  View,
  ScrollView,
  useWindowDimensions,
  unstable_batchedUpdates,
} from "react-native";
import { SearchButton } from "./SearchButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateFilter, ChannelFilter } from "./SearchFilter";

export enum PanelStatus {
  Showing,
  Showed,
  Closing,
  Closed,
}

export interface SearchPanelPropsType {
  show?: boolean;
  panelWidth?: number;
  onClosed?(): void;
  onShowed?(): void;
  onPanelStatusChange?(status: PanelStatus): void;
  onSearchPress?(searchCriteria: SearchCriteria): void;
}

export interface SearchCriteria {
  date: string | null;
  channel: string | null;
}

/**
 * @todo
 * - Touchmove gesture
 *
 * @param props
 * @returns
 */
export function SearchPanel(props: SearchPanelPropsType) {
  const {
    onClosed,
    onShowed,
    onSearchPress,
    show = false,
    onPanelStatusChange,
  } = props;
  const [date, setDate] = useState<string | null>(null);
  const [channel, setChannel] = useState<string | null>(null);
  const windowSize = useWindowDimensions();
  const [panelStatus, setPanelStatus] = useState<PanelStatus>(
    PanelStatus.Closed
  );

  const panelWidth = props.panelWidth || (windowSize.width * 0.75) & -1;

  // const latestAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const sliderAnim = useState(() => new Animated.Value(-panelWidth))[0];

  const createSlideAction = (type: "in" | "out") => {
    return Animated.timing(sliderAnim, {
      toValue: type === "in" ? panelWidth : 0,
      duration: 300,
      useNativeDriver: true,
    });
  };

  useEffect(() => {
    setPanelStatus(show ? PanelStatus.Showing : PanelStatus.Closing);
    const animConfig = createSlideAction(show ? "in" : "out");
    animConfig.start(({ finished }) => {
      if (finished) {
        unstable_batchedUpdates(() => {
          show ? onShowed?.() : onClosed?.();
          setPanelStatus(show ? PanelStatus.Showed : PanelStatus.Closed);
        });
      }
    });
  }, [show]);

  useEffect(() => {
    onPanelStatusChange?.(panelStatus);
  }, [panelStatus, onPanelStatusChange]);

  const tip = useMemo(() => {
    if (!channel) {
      return undefined;
    }
    const tipChunks = [`${channel} activities`];
    if (date) {
      const mc = date.match(/\d{2}\/\d{2}\/\d{4}/g);
      if (mc && mc.length === 2) {
        let [start, end] = mc;
        start = start.substring(0, 5);
        end = end.substring(0, 5);
        tipChunks.push(`from ${start} to ${end}`);
      } else {
        tipChunks.push(`from ${date.toLowerCase()}`);
      }
    }

    return tipChunks.join(" ");
  }, [date, channel]);

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        top: 0,
        left: -panelWidth,
        bottom: 0,
        zIndex: 200,
      }}
    >
      <Animated.View
        style={[
          styles.root,
          { maxWidth: panelWidth },
          { transform: [{ translateX: sliderAnim }] },
        ]}
      >
        <ScrollView>
          <View style={{ height: 10 }} />
          <DateFilter value={date} onChange={setDate} />
          <View style={{ height: 24 }} />
          <ChannelFilter value={channel} onChange={setChannel} />
          <View style={{ height: 24 }} />
        </ScrollView>
        <SearchButton
          tip={tip}
          onPress={() => {
            onSearchPress?.({
              date,
              channel,
            });
          }}
          disabled={!channel}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    height: "100%",
    backgroundColor: "#453257",
    zIndex: 200,
    elevation: 200,
    justifyContent: "space-between",
  },
});
