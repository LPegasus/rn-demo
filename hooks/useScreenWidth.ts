import { useWindowDimensions } from "react-native";

/**
 * Get width based on screen width.
 * 
 * @param percent - between 0 and 1
 */
export function useScreenWidth(percent: number) {
  const { width } = useWindowDimensions();
  return width * percent & -1;
}
