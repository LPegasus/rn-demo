import {
  ActionButtonPropsType,
  ActionsBlock,
  ActionsBlockPropsType,
} from "../../components/ActionsBlock";

const sourceData: Array<Pick<ActionButtonPropsType, "type" | "icon" | "tip">> =
  [
    {
      tip: "Details",
      type: "Details",
      icon: [
        require("../../assets/imgs/icon/info-blank.png"),
        require("../../assets/imgs/icon/info.png"),
      ],
    },
    {
      tip: "Participants",
      type: "Participants",
      icon: [
        require("../../assets/imgs/icon/participant-blank.png"),
        require("../../assets/imgs/icon/participant.png"),
      ],
    },
    {
      tip: "Comments",
      type: "Comments",
      icon: [
        require("../../assets/imgs/icon/comment-blank.png"),
        require("../../assets/imgs/icon/comment.png"),
      ],
    },
  ];

export function DetailActionBlock(props: Omit<ActionsBlockPropsType, "items">) {
  return <ActionsBlock {...props} items={sourceData} />;
}
