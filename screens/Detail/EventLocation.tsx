import { memo } from "react";
import { View, Text } from "react-native";
import { GetEventDetailResponseBody } from "../../api/interface";
import { SectionLabel } from "../../components/SectionLabel";

export const EventLocation = memo(
  ({ event }: { event: GetEventDetailResponseBody["event"] }) => {
    return (
      <View style={{ padding: 16 }}>
        <SectionLabel>Where</SectionLabel>
        <Text style={{ marginVertical: 8 }}>{event.location}</Text>
        <Text style={{ color: "#67616D" }}>{event.location_detail}</Text>
        <View
          style={{
            marginTop: 8,
            backgroundColor: "#ccc",
            height: 88,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>HERE IS MAP</Text>
        </View>
      </View>
    );
  }
);
