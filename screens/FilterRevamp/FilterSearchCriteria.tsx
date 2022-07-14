import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FilterTag } from "./FilterTag";
import { StarsFilter } from "./StarsFilter";
import { TextFilterTag } from "./TextFilterTag";

export interface FilterSearchCriteriaPropsType {
  defaultSelectedTag?: string;
  onFilterChange?: (keys: string[]) => void;
}

export function FilterSearchCriteria(props: FilterSearchCriteriaPropsType) {
  const { onFilterChange, defaultSelectedTag = "All" } = props;
  const [activeFilters, setActiveFilters] = useState<string[]>([
    defaultSelectedTag,
  ]);

  useEffect(() => {
    onFilterChange?.(activeFilters);
  }, [activeFilters]);

  return (
    <>
      <View style={{ paddingHorizontal: 12, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row" }}>
          {["All", "With Comments", "With Pic/Video"].map((title) => {
            return (
              <TextFilterTag
                key={title}
                active={activeFilters.includes(title)}
                onPress={() => {
                  setActiveFilters((s) => {
                    if (s.includes(title)) {
                      return s;
                    } else {
                      return [title];
                    }
                  });
                }}
                count={100}
                title={title}
              />
            );
          })}
        </View>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          {[5, 4, 3, 2, 1].map((d) => {
            return (
              <StarsFilter
                starCount={d}
                active={activeFilters.includes(`star:${d}`)}
                count={666}
                onPress={() => {
                  setActiveFilters((s) => {
                    return [`star:${d}`];
                  });
                }}
              />
            );
          })}
        </View>
      </View>
    </>
  );
}
