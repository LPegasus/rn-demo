import React, { useMemo } from "react";
import {
  ActionButtonPropsType,
  ActionsBlock,
  ActionsBlockPropsType,
} from "../../components/ActionsBlock";

export type ActionType = "likes" | "going" | "past";

const sourceData: Array<Pick<ActionButtonPropsType, "type" | "icon">> = [
  {
    type: "likes",
    icon: [
      require("../../assets/imgs/icon/fav-blank.png"),
      require("../../assets/imgs/icon/green-fav2.png"),
    ],
  },
  {
    type: "going",
    icon: [
      require("../../assets/imgs/icon/right-blank.png"),
      require("../../assets/imgs/icon/right.png"),
    ],
  },
  {
    type: "past",
    icon: [
      require("../../assets/imgs/icon/footprint-blank.png"),
      require("../../assets/imgs/icon/footprint.png"),
    ],
  },
];

export function MeActionsBlock(
  props: Omit<ActionsBlockPropsType, "items"> & {
    count: Partial<Record<ActionType, number>>;
  }
) {
  const { count } = props;
  const items = useMemo<ActionsBlockPropsType["items"]>(() => {
    return sourceData.map((d) => {
      return {
        ...d,
        tip: `${count[d.type as ActionType]} ${d.type}`,
      };
    });
  }, []);
  return <ActionsBlock {...props} items={items} />;
}
