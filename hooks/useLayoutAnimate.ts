import { useCallback } from "react";
import { LayoutAnimation, LayoutAnimationConfig } from "react-native";

export function useLayoutAnimateCallback<T extends (...args: any[]) => any>(
  callback: T,
  animConfig: LayoutAnimationConfig = LayoutAnimation.Presets.easeInEaseOut
) {
  return useCallback((...args: any[]) => {
    LayoutAnimation.configureNext(animConfig);
    return callback(...args);
  }, [callback]) as T;
}
