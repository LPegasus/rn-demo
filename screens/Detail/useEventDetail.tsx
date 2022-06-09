import { GetEventDetailMock } from "../../api";
import { useFetchData } from "../../hooks/useFetchData";

export function useEventDetail(eventId: number) {
  return useFetchData(GetEventDetailMock, [eventId]);
}
