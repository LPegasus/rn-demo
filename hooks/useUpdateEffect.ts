import { useEffect, useRef } from "react";

export function useUpdateEffect(...args: Parameters<typeof useEffect>) {
  const ref = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      return;
    }
    return args[0]();
  }, args[1]);
}
