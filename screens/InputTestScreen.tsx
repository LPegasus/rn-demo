import { Text, TextInput, View } from "react-native";

export function InputTestScreen() {
  return (
    <View>
      <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
        <Text style={{ color: "#fff" }}>TestInput:</Text>
        <TextInput
          style={{ backgroundColor: "#fff", width: "100%" }}
          multiline={true}
          numberOfLines={5}
          onChangeText={(value) => {
            console.log(value, value.length);
          }}
        />
      </View>
    </View>
  );
}
