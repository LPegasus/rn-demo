import { GetEventDetailResponseBody } from "../../api/interface";
import {
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picture } from "../../components/Picture";
import { useState } from "react";
import { useLayoutAnimateCallback } from "../../hooks/useLayoutAnimate";

export interface DetailPresentationPropsType {
  event: GetEventDetailResponseBody;
}

export function DetailPresentation(
  props: DetailPresentationPropsType["event"]
) {
  const { images, description } = props.event;
  const [expand, _setExpand] = useState(false);
  const setExpand = useLayoutAnimateCallback(_setExpand);
  const [descContentHeight, setDescContentHeight] = useState(0);

  const needExpand = descContentHeight - 5 > 180;

  return (
    <View style={{ backgroundColor: "#FAF9FC", paddingBottom: 19 }}>
      <ScrollView
        horizontal={true}
        style={{ paddingVertical: 16 }}
        showsHorizontalScrollIndicator={false}
      >
        {images.length > 0 &&
          images.map((url) => {
            return <Picture key={url} url={url} />;
          })}
      </ScrollView>
      <View
        style={[
          styles.descRoot,
          needExpand && expand && { maxHeight: descContentHeight },
        ]}
      >
        <ScrollView
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          collapsable={false}
        >
          <Text
            style={styles.desc}
            onLayout={(e) => setDescContentHeight(e.nativeEvent.layout.height)}
          >
            {description}
          </Text>
        </ScrollView>
        {needExpand && !expand && (
          <>
            <View style={styles.descBottomMask}>
              <Image
                source={require("../../assets/imgs/icon/white-mask.png")}
                style={{ width: "100%" }}
                resizeMode="stretch"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setExpand((s) => !s);
              }}
            >
              <View style={styles.viewAllBtn}>
                <Text
                  style={{
                    textTransform: "uppercase",
                    color: "#67616D",
                    fontSize: 10,
                  }}
                >
                  VIEW ALL
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewAllBtn: {
    position: "absolute",
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D5EF7F",
    right: 0,
    bottom: 2,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  descRoot: {
    position: "relative",
    maxHeight: 180,
    paddingHorizontal: 16,
  },
  descBottomMask: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  desc: {
    fontSize: 14,
    fontWeight: "400",
    color: "#67616d",
  },
});
