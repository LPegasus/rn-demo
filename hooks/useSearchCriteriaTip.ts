import { useMemo } from "react";
import { SearchCriteria } from "../screens/Feeds/SearchPanel";

export function useSearchCriteriaTip(searchCriteria: SearchCriteria | undefined | null, type: 'button' | 'result' = 'button') {
  const { channel, date } = searchCriteria || {};
  const tip = useMemo(() => {
    if (!channel) {
      return undefined;
    }
    const tipChunks = [type === 'button' ? `${channel} activities` : `Search for ${channel}`];
    if (date) {
      const mc = date.match(/\d{2}\/\d{2}\/\d{4}/g);
      if (mc && mc.length === 2) {
        let [start, end] = mc;
        start = start.substring(0, 5);
        end = end.substring(0, 5);
        tipChunks.push(`from ${start} to ${end}`);
      } else {
        tipChunks.push(`from ${date.toLowerCase()}`);
      }
    }

    return tipChunks.join(" ");
  }, [date, channel]);

  return tip;
}
