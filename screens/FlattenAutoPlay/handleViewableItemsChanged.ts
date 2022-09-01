import { ViewToken } from "react-native";

export const handleViewableItemsChanged = ({
  changed,
  viewableItems,
}: {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}) => {
  console.log("changed");
  console.log("viewableItems", viewableItems.map(d => d.key));
};

export const viewabilityConfig = {
  itemVisiblePercentThreshold: 0,
  waitForInteraction: false,
};
