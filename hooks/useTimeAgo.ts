import { useMemo } from "react";
import { Timestamp } from "../api/interface";

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

export function useTimeAgo(t: Timestamp, deps: any[] = []) {
  return useMemo(() => {
    const span = Date.now() - new Date(t).valueOf();
    if (span > day) {
      return `${Math.floor(span / day)} days ago`;
    } else if (span > hour) {
      return `${Math.floor(span / hour)} hours ago`;
    } else {
      return `just now`;
    }
  }, [...deps, t]);
}
