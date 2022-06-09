import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

export function ChannelTag(props: {
  children: string;
  onPress?(channelName: string): void;
  style?: ViewStyle;
}) {
  const { onPress, children, style } = props;
  return (
    <TouchableOpacity onPress={() => onPress?.(children)}>
      <View
        style={[
          {
            height: 20,
            borderColor: "#D3C1E5",
            borderRadius: 10,
            borderWidth: 1,
            paddingHorizontal: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}
      >
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            fontSize: 12,
            color: "#8560A9",
          }}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
