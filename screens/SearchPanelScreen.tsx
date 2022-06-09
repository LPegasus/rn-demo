import { SafeAreaView } from "react-native-safe-area-context";
import { SearchPanel } from "./Feeds/SearchPanel";
import { useState } from "react";
import { Alert, Button, View } from "react-native";

export function SearchPanelScreen() {
  const [show, setShow] = useState(false);
  return (
    <SafeAreaView>
      <SearchPanel show={show} />
      <View
        style={{
          position: "absolute",
          top: 100,
          right: 16,
        }}
      >
        <Button
          title={show ? "hide" : "show"}
          onPress={() => {
            setShow((s) => !s);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
