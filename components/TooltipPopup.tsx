import {
  cloneElement,
  FunctionComponentElement,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  LayoutChangeEvent,
  LayoutRectangle,
  PressableProps,
  View,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from "react-native";

export interface TooltipPopupPropsType {
  children: FunctionComponentElement<
    PressableProps & React.RefAttributes<View>
  >;
  onClosed?(): void;
  renderTooltip(layout: LayoutRectangle): JSX.Element;
}

const emptyLayout: LayoutRectangle = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
};

export function TooltipPopup(props: TooltipPopupPropsType) {
  const { children, renderTooltip } = props;
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle>(emptyLayout);
  const originProps = children.props;

  const onPress: PressableProps["onPress"] = (e) => {
    setVisible((s) => !s);
    originProps.onPress?.(e);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
    originProps.onLayout?.(e);
  };

  const newProps: typeof originProps = {
    ...originProps,
    onLayout,
    onPress,
  };

  if (!children) return null;
  return (
    <>
      {cloneElement(children, newProps)}
      <Pressable
        onPress={() => setVisible(false)}
        style={{
          display: visible ? "flex" : "none",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 100, 0, 0.3)",
        }}
      >
        {renderTooltip(layout)}
      </Pressable>
    </>
  );
}
