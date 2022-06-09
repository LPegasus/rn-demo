import { View, Text } from "react-native";

export function EventTitle(props: { children: string }) {
  return (
    <View
      style={{
        paddingTop: 11,
      }}
    >
      <Text
        selectable={true}
        style={{
          lineHeight: 24,
          fontSize: 18,
          fontWeight: "500",
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {props.children}
      </Text>
    </View>
  );
}
