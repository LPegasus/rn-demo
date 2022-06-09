import {
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";

export function DateRangePicker(props: {
  value: [string, string];
  onChange?(v: [string, string]): void;
}) {
  const { value, onChange } = props;
  const [startDate, endDate] = value;

  const handleChangeRef = useRef<typeof onChange>();
  handleChangeRef.current = onChange;

  useEffect(() => {
    handleChangeRef.current?.([startDate, endDate]);
  }, [startDate, endDate]);

  return (
    <Pressable
      onPress={() => {
        console.log("clicked");
      }}
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.root}>
        <View style={styles.arrow} />
        <View style={styles.content}>
          <Image source={require("../assets/imgs/icon/arrow-right.png")} />
          <DatePicker
            value={startDate}
            onChange={(v) => {
              onChange?.([v, endDate]);
            }}
          />
          <View style={styles.separate} />
          <Image source={require("../assets/imgs/icon/arrow-left.png")} />
          <DatePicker
            value={endDate}
            onChange={(v) => {
              onChange?.([startDate, v]);
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}

function parseDateString(str: string): Date {
  const [date, month, year] = str.split("/");
  return new Date(+year, +month - 1, +date);
}

function padZero(n: number): string {
  if (n < 10) {
    return "0" + String(n);
  }
  return String(n);
}

function getDateString(date: Date): string {
  return `${padZero(date.getDate())}/${padZero(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
}

export function DatePicker(props: {
  value?: string;
  onChange?(v: string): void;
}) {
  const { value, onChange } = props;
  const [show, setShow] = useState(false);
  const normalizedValue = value ? parseDateString(value) : new Date();

  return (
    <>
      <TouchableHighlight
        style={styles.input}
        underlayColor="#D5EF7F"
        onPress={() => setShow(true)}
      >
        <Text style={{ textAlign: "right" }}>{value || ""}</Text>
      </TouchableHighlight>

      {show && (
        <DateTimePicker
          accentColor="#D5EF7F"
          mode="date"
          value={normalizedValue}
          onChange={(_, date) => {
            let str = date ? getDateString(date) : "";
            onChange?.(str);
            setShow(false);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "rgba(0,0,0,0)",
    paddingTop: 8,
  },
  arrow: {
    backgroundColor: "#fff",
    position: "absolute",
    transform: [{ translateY: 5 }, { translateX: 10 }, { rotateZ: "45deg" }],
    width: 10,
    height: 10,
  },
  content: {
    backgroundColor: "#fff",
    paddingHorizontal: 9,
    paddingVertical: 7,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  separate: {
    height: 1,
    width: 6,
    marginHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  input: {
    color: "#8560A9",
    fontSize: 14,
    minWidth: 66,
    marginHorizontal: 6,
  },
});
