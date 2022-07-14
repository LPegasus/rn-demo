import { View, FlatList, Text } from "react-native";
import { FilterSearchCriteria } from "./FilterRevamp/FilterSearchCriteria";
import { RootStackScreenProps } from "../types";

export interface FilterRevampScreenPropsType
  extends RootStackScreenProps<"FilterRevamp"> {}

export function FilterRevampScreen(props: FilterRevampScreenPropsType) {
  return <FilterSearchCriteria />;
}
