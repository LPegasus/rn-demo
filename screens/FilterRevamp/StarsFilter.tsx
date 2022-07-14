import { FilterTag, FilterTagPropsType } from "./FilterTag";
import { View, ViewStyle, Text } from "react-native";
import { Star } from "./Star";

const starStyle: ViewStyle = {
  marginLeft: 1,
};

export function StarsFilter(
  props: Omit<FilterTagPropsType, "title"> & { starCount: number }
) {
  const { starCount, ...rest } = props;

  const allStars: JSX.Element[] = [];
  for (let i = 0; i < starCount; i++) {
    allStars.push(<Star style={starStyle} />);
  }

  const title = (
    <View style={{ height: 14, alignItems: "center", flexDirection: "row" }}>
      {[...allStars]}
    </View>
  );
  return <FilterTag {...rest} title={title} />;
}
