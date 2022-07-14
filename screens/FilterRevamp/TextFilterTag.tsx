import { Text } from "react-native";
import {
  FilterTag,
  FilterTagPropsType,
  textStyle,
  activeTextStyle,
} from "./FilterTag";

export function TextFilterTag(
  props: Omit<FilterTagPropsType, "title"> & { title: string }
) {
  const title = (
    <Text
      ellipsizeMode="tail"
      lineBreakMode="clip"
      numberOfLines={1}
      style={[textStyle, props.active && activeTextStyle]}
    >
      {props.title}
    </Text>
  );
  return <FilterTag {...props} title={title} />;
}
