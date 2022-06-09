import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { from } from "rxjs";
import { PostComment } from "../../api";

export interface CommentInputPropsType {
  onSubmitSuccess: (comment: string) => void;
  onClose: () => void;
  placeholder: string;
  eventId: number;
}

export function CommentInput(props: CommentInputPropsType) {
  const { onClose, eventId, onSubmitSuccess, placeholder } = props;
  const [text, setText] = useState(placeholder);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    /** Use submitting state to trigger submit post */
    if (!submitting) {
      return;
    }
    const sub = from(PostComment(eventId, { comment: text })).subscribe({
      next: (payload) => {
        if (payload.type === "success") {
          setSubmitting(false);
          onSubmitSuccess(text);
        }
      },
      error: (err) => {
        setSubmitting(false);
        Alert.alert(String("Comment Failed. " + String(err)));
      },
    });

    return () => sub.unsubscribe();
  }, [submitting]);

  return (
    <View style={styles.root}>
      <View style={styles.inputRoot}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Image
            source={require("../../assets/imgs/icon/close.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <TextInput
          editable={!submitting}
          style={styles.input}
          value={text}
          onChangeText={setText}
          clearButtonMode="always"
          collapsable={true}
          multiline={true}
          numberOfLines={1}
        />
      </View>
      <TouchableOpacity
        disabled={!text}
        style={[styles.send, !text && styles.sendDisabled]}
        activeOpacity={0.7}
        onPress={() => {
          if (!text) {
            return;
          }
          setSubmitting(true);
        }}
      >
        <View>
          <Image source={require("../../assets/imgs/icon/send.png")} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#8560A9",
    height: 56,
    flexDirection: "row",
  },
  send: {
    flexBasis: "25%",
    backgroundColor: "#D5EF7F",
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: {
    backgroundColor: "#ccc",
  },
  inputRoot: {
    flexBasis: "75%",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#fff",
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 16,
  },
});
