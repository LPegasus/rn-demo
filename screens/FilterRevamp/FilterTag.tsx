import {
  GestureResponderEvent,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

const activeRootStyle: ViewStyle = {
  backgroundColor: "#fff",
  borderColor: "#f50",
};

const tagRootStyle: ViewStyle = {
  backgroundColor: "#ccc",
  padding: 8,
  marginLeft: 4,
  flex: 1,
  borderRadius: 4,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ccc",
};

export const activeTextStyle: TextStyle = {
  color: "#f50",
};

export const textStyle: TextStyle = {
  fontSize: 10,
};

export interface FilterTagPropsType {
  onPress: (evt: GestureResponderEvent) => void;
  count: number;
  title: JSX.Element;
  active?: boolean;
  style?: ViewStyle;
}

export function FilterTag(props: FilterTagPropsType) {
  const { onPress, count, title, style, active = false } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[tagRootStyle, active && activeRootStyle, style]}>
        <View>{title}</View>
        <View style={{ alignItems: "center" }}>
          <Text style={[textStyle, active && activeTextStyle]}>({count})</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
