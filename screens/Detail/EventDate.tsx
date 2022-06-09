import { useMemo } from "react";
import { Text, StyleSheet, Image, View } from "react-native";
import { GetEventDetailResponseBody } from "../../api/interface";
import { SectionLabel } from "../../components/SectionLabel";

export interface EventDatePropsType {
  event: GetEventDetailResponseBody["event"];
}

export function EventDate(props: EventDatePropsType) {
  const { event } = props;
  const { begin_time, end_time } = event;

  const { startDateStr, endDateStr, startTimeStr, amOrPm } = useMemo(() => {
    const startDate = new Date(begin_time);
    const endDate = new Date(end_time);
    const h = startDate.getHours();
    const m = startDate.getMinutes();
    return {
      /** NEED DESIGN: Not sure how to handle i18n time format, use native api for now. */
      startDateStr: startDate.toLocaleDateString(),
      endDateStr: endDate.toLocaleDateString(),
      startTimeStr: String(h <= 11 ? h : h === 12 ? 12 : h - 12) + ":" + m,
      amOrPm: h >= 12 ? "pm" : "am",
    };
  }, [begin_time, end_time]);

  return (
    <View style={styles.root}>
      <SectionLabel>When</SectionLabel>
      <View style={styles.content}>
        <View style={styles.info}>
          <View style={styles.label}>
            <Image
              style={styles.img}
              source={require("../../assets/imgs/icon/arrow-right.png")}
            />
            <Text>{startDateStr}</Text>
          </View>
          <Text style={styles.time}>
            {startTimeStr}
            <Text style={{ fontSize: 10 }}>{`  ${amOrPm}`}</Text>
          </Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.info}>
          <View style={styles.label}>
            <Image
              style={styles.img}
              source={require("../../assets/imgs/icon/arrow-left.png")}
            />
            <Text>{endDateStr}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
  time: {
    color: "#AECB4F",
    fontSize: 32,
    textAlign: "center",
    textAlignVertical: "bottom",
  },
  text: { color: "#67616D", fontSize: 16 },
  img: { height: 16, width: 16, marginRight: 4 },
  divider: {
    width: 1,
    backgroundColor: "#E8E8E8",
    flexBasis: 1,
  },
  info: {
    flex: 1,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    height: 74,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
