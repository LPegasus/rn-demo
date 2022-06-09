import { useEffect, useRef, useState } from "react";
import {
  View,
  TextStyle,
  Text,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import { DateRangePicker } from "../../components/DateRangePicker";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ALL_DATE = ["ANYTIME", "TODAY", "TOMORROW", "THIS WEEK", "THIS MONTH"];

const ALL_CHANNEL = [
  "All",
  "Channel 1",
  "Channel 2",
  "Channel 3",
  "Channel 4",
  "Channel 5",
  "Channel with lone name | Channel with lone name",
  "Channel with lone name",
];

export interface FilterPropsType {
  value: string | null;
  onChange?(v: string | null): void;
}

function isDateRange(v?: string | null) {
  return Boolean(v) && /^\d{2}\/\d{2}\/\d{4},\d{2}\/\d{2}\/\d{4}$/.test(v!);
}

export function DateFilter(props: FilterPropsType) {
  const { value, onChange } = props;
  const [showDateRange, setShowDateRange] = useState(() => {
    return isDateRange(value);
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onChangeRef = useRef<typeof onChange>();
  onChangeRef.current = onChange;

  const latestValueRef = useRef<typeof value>();
  latestValueRef.current = value;

  useEffect(() => {
    if (startDate && endDate && showDateRange) {
      const v = `${startDate},${endDate}`;
      if (latestValueRef.current === v) {
        return;
      }
      onChangeRef.current?.(`${startDate},${endDate}`);
    }
  }, [startDate, endDate, showDateRange]);

  useEffect(() => {
    if (
      showDateRange &&
      value &&
      !/^\d{2}\/\d{2}\/\d{4},\d{2}\/\d{2}\/\d{4}$/.test(value)
    ) {
      onChangeRef.current?.(null);
    }
  }, [showDateRange, value]);

  useEffect(() => {
    if (
      !showDateRange &&
      value &&
      /^\d{2}\/\d{2}\/\d{4},\d{2}\/\d{2}\/\d{4}$/.test(value)
    ) {
      const [start, end] = value.split(",");
      if (start === startDate && end === endDate) {
        return;
      }
      setEndDate(end);
      setStartDate(start);
    }
  }, [value, showDateRange, startDate, endDate]);

  return (
    <>
      <Filter
        name="date"
        options={ALL_DATE}
        optionStyle={{ fontSize: 14, fontWeight: "700" }}
        {...props}
      >
        {ALL_DATE.map((keyword, i) => {
          const handlePress = !onChange
            ? undefined
            : () => {
                value === keyword ? onChange(null) : onChange(keyword);
                if (showDateRange) {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                  );
                  setShowDateRange(false);
                }
              };
          return (
            <Tag
              style={{ fontWeight: "700" }}
              selected={keyword === value && !showDateRange}
              key={String(i)}
              keyword={keyword}
              onPress={handlePress}
            />
          );
        })}
        <View
          style={{
            display: "flex",
            flexBasis: "100%",
            alignItems: "flex-start",
          }}
        >
          <Tag
            selected={showDateRange}
            style={{ fontWeight: "700" }}
            keyword="LATER"
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              if (showDateRange) {
                onChange?.(null);
              } else if (startDate && endDate) {
                onChange?.(`${startDate},${endDate}`);
              }
              setShowDateRange(!showDateRange);
            }}
          />
        </View>
      </Filter>
      {showDateRange && (
        <DateRangePicker
          value={[startDate, endDate]}
          onChange={([start, end]) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      )}
    </>
  );
}

export function ChannelFilter(props: FilterPropsType) {
  return (
    <Filter
      name="channel"
      options={ALL_CHANNEL}
      optionStyle={{
        borderWidth: 1,
        borderColor: "#FFFFFF",
        marginRight: 12,
      }}
      {...props}
    />
  );
}

interface _FilterPropsType {
  onChange?(keyword: string | null): void;
  value: string | null;
  options?: string[];
  optionStyle?: TextStyle;
  name: string;
  children?: any;
}

function Filter(props: _FilterPropsType) {
  const { onChange, name, value, children, options, optionStyle } = props;
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Label text={name} />
      </View>
      <View
        style={{
          marginTop: 13,
          justifyContent: "flex-start",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {children ||
          options?.map((d, i) => {
            return (
              <Tag
                key={String(i)}
                keyword={d}
                style={optionStyle}
                selected={value === d}
                onPress={() => {
                  if (!onChange) {
                    return;
                  }
                  value === d ? onChange(null) : onChange(d);
                }}
              />
            );
          })}
      </View>
    </View>
  );
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

export interface TagPropsType {
  selected?: boolean;
  keyword: string;
  style?: TextStyle;
  onPress?(): void;
  onLayout?(e: LayoutChangeEvent): void;
}

function Tag({ selected, keyword, style, onPress, onLayout }: TagPropsType) {
  return (
    <Pressable onPress={onPress} onLayout={onLayout}>
      <Text
        ellipsizeMode="tail"
        style={[styles.tag, style, selected && styles.tagSelected]}
        numberOfLines={1}
      >
        {keyword}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  label: {
    color: "#AC8EC9",
    fontSize: 12,
    textAlign: "center",
    textTransform: "uppercase",
    paddingBottom: 2,
    borderBottomColor: "#AC8EC9",
    borderBottomWidth: 1,
  },
  tag: {
    height: 24,
    marginTop: 12,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0)",
    textAlignVertical: "center",
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
  } as TextStyle,
  tagSelected: {
    backgroundColor: "#E5F7A9",
    borderColor: "#E5F7A9",
    color: "#453257",
  } as TextStyle,
});
