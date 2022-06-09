import React from "react";
import { Text, StyleSheet, View, Image, Pressable } from "react-native";

export interface ActionsBlockPropsType {
  onActionTypeChange?(type: string): void;
  selectedAction?: string;
  items: Pick<ActionButtonPropsType, "type" | "icon" | "tip">[];
}

export interface ActionButtonPropsType {
  type: string;
  icon: [any, any];
  tip: string;
  selected: boolean;
  onPress(p: ActionButtonPropsType): void;
}

export function ActionsBlock(props: ActionsBlockPropsType) {
  const { selectedAction, onActionTypeChange, items } = props;
  const handlePress = (p: ActionButtonPropsType) => {
    onActionTypeChange?.(p.type);
  };

  return (
    <View style={styles.root}>
      {items.map((d, i, arr) => {
        return (
          <React.Fragment key={d.type}>
            <ActionButton
              {...d}
              selected={selectedAction === d.type}
              tip={d.tip}
              onPress={handlePress}
            />
            {i < arr.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function ActionButton(props: ActionButtonPropsType) {
  const { selected, icon, onPress, tip } = props;

  return (
    <Pressable onPress={() => onPress(props)}>
      <View style={styles.button}>
        <Image
          style={{ width: 16 }}
          resizeMode="contain"
          source={icon[selected ? 1 : 0]}
        />
        <Text style={[styles.text, selected && styles.selected]}>{tip}</Text>
      </View>
    </Pressable>
  );
}

function Divider() {
  return (
    <View style={styles.divider}>
      <View style={{ width: 1, height: 12, backgroundColor: "#E8E8E8" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    maxHeight: 20,
    minHeight: 20,
    flexGrow: 0,
    flexShrink: 0,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
  },
  root: {
    backgroundColor: "#fff",
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 14,
  },
  text: {
    color: "#8C8C8C",
    textTransform: "capitalize",
    fontSize: 12,
    marginLeft: 5,
    fontWeight: "400",
  },
  selected: {
    color: "#AECB4F",
    fontWeight: "700",
  },
});
