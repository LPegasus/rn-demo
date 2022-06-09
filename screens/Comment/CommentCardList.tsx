import { Comment } from "../../api/interface";
import { CommentCard } from "./CommentCard";
import { View } from "react-native";
import { useState } from "react";

export interface CommentCardListPropsType {
  eventId: number;
}

export function CommentCardList(props: CommentCardListPropsType) {
  const [comments, setComments] = useState<Comment[]>([
    {
      author: { username: "LPegasus", avatar: "", id: 1 },
      comment:
        "Nullam ut tincidunt nunc. Petus lacus, commodo eget justo ut, rutrum varius nunc.",
      create_time: Date.now() - 5000000,
      id: 1,
    },
  ]);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        width: "100%",
        overflow: "hidden",
        paddingTop: 16,
      }}
    >
      {comments.map((comment) => {
        return <CommentCard key={comment.id} comment={comment} />;
      })}
    </View>
  );
}
